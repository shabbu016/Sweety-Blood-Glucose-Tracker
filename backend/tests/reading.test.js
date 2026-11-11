
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const pool = require("../src/config/database");
const app = require("../src/app");

const email = `reading-test-${Date.now()}@example.com`;
const password = "TestPass123";

let token;
let userId;
let readingId;

// Get tomorrow's date using India time.
const getTomorrowInIndia = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const dateParts = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    const tomorrow = new Date(Date.UTC(
        Number(dateParts.year),
        Number(dateParts.month) - 1,
        Number(dateParts.day) + 1
    ));

    return tomorrow.toISOString().slice(0, 10);
};

test("Reading API", async (t) => {
    await t.before(async () => {
        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Reading Test User",
                email,
                password
            });

        assert.equal(registerResponse.status, 201);

        token = registerResponse.body.token;
        userId = registerResponse.body.user.id;
    });

    await t.test("should reject unauthenticated requests", async () => {
        const response = await request(app)
            .get("/api/readings");

        assert.equal(response.status, 401);
    });

    await t.test("should create a glucose reading", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "morning_fasting",
                glucose_value: 120
            });

        assert.equal(response.status, 201);
        assert.equal(response.body.success, true);
        assert.equal(response.body.reading.glucose_value, 120);

        readingId = response.body.reading.id;
    });

    await t.test("should reject glucose value below 40", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "after_breakfast",
                glucose_value: 39
            });

        assert.equal(response.status, 400);
    });

    await t.test("should reject glucose value above 600", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "after_breakfast",
                glucose_value: 601
            });

        assert.equal(response.status, 400);
    });

    await t.test("should reject decimal glucose values", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "after_breakfast",
                glucose_value: 120.5
            });

        assert.equal(response.status, 400);
    });

    await t.test("should reject future dates", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: getTomorrowInIndia(),
                time_slot: "after_breakfast",
                glucose_value: 120
            });

        assert.equal(response.status, 400);
    });

    await t.test("should reject duplicate date and time slot", async () => {
        const response = await request(app)
            .post("/api/readings")
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "morning_fasting",
                glucose_value: 130
            });

        assert.equal(response.status, 409);
    });

    await t.test("should retrieve only the test user's readings", async () => {
        const response = await request(app)
            .get("/api/readings")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.count, 1);
        assert.equal(response.body.readings[0].user_id, undefined);
        assert.equal(response.body.readings[0].glucose_value, 120);
    });

    await t.test("should update a reading", async () => {
        const response = await request(app)
            .put(`/api/readings/${readingId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "morning_fasting",
                glucose_value: 125
            });

        assert.equal(response.status, 200);
        assert.equal(response.body.reading.glucose_value, 125);
    });

    await t.test("should reject an invalid reading ID", async () => {
        const response = await request(app)
            .delete("/api/readings/invalid")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 400);
    });

    await t.test("should prevent another user from updating a reading", async () => {
        const secondEmail = `second-user-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Second Test User",
                email: secondEmail,
                password: "TestPass123"
            });

        assert.equal(registerResponse.status, 201);

        const secondToken = registerResponse.body.token;

        const response = await request(app)
            .put(`/api/readings/${readingId}`)
            .set("Authorization", `Bearer ${secondToken}`)
            .send({
                reading_date: "2026-11-11",
                time_slot: "morning_fasting",
                glucose_value: 150
            });

        assert.equal(response.status, 404);

        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [registerResponse.body.user.id]
        );
    });

    await t.test("should prevent another user from deleting a reading", async () => {
        const secondEmail = `delete-user-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Another Test User",
                email: secondEmail,
                password: "TestPass123"
            });

        assert.equal(registerResponse.status, 201);

        const response = await request(app)
            .delete(`/api/readings/${readingId}`)
            .set("Authorization", `Bearer ${registerResponse.body.token}`);

        assert.equal(response.status, 404);

        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [registerResponse.body.user.id]
        );
    });

    await t.test("should delete a reading", async () => {
        const response = await request(app)
            .delete(`/api/readings/${readingId}`)
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
    });

    await t.after(async () => {
        if (userId) {
            await pool.query(
                "DELETE FROM users WHERE id = $1",
                [userId]
            );
        }
    });
});
