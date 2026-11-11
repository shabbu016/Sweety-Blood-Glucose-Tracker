
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const pool = require("../src/config/database");
const app = require("../src/app");

const email = `report-test-${Date.now()}@example.com`;
const password = "TestPass123";

let token;
let userId;

test("Reports API", async (t) => {
    await t.before(async () => {
        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Report Test User",
                email,
                password
            });

        assert.equal(registerResponse.status, 201);

        token = registerResponse.body.token;
        userId = registerResponse.body.user.id;

        await pool.query(
            `INSERT INTO readings
                (user_id, reading_date, time_slot, glucose_value)
             VALUES
                ($1, '2026-11-11', 'morning_fasting', 100),
                ($1, '2026-11-11', 'after_breakfast', 120)`,
            [userId]
        );
    });

    await t.test("should reject unauthenticated report requests", async () => {
        const response = await request(app)
            .get("/api/reports/summary");

        assert.equal(response.status, 401);
    });

    await t.test("should calculate summary correctly", async () => {
        const response = await request(app)
            .get("/api/reports/summary")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.summary.highest, 120);
        assert.equal(response.body.summary.lowest, 100);
        assert.equal(response.body.summary.average, 110);
        assert.equal(response.body.summary.total_readings, 2);
    });

    await t.test("should return daily report with four slots", async () => {
        const response = await request(app)
            .get("/api/reports/daily?date=2026-11-11")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.total_readings, 2);
        assert.equal(response.body.slots.length, 4);
        assert.equal(response.body.slots[0].reading.glucose_value, 100);
        assert.equal(response.body.slots[1].reading.glucose_value, 120);
        assert.equal(response.body.slots[2].reading, null);
        assert.equal(response.body.slots[3].reading, null);
    });

    await t.test("should reject an invalid daily report date", async () => {
        const response = await request(app)
            .get("/api/reports/daily?date=invalid")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 400);
    });

    await t.test("should return current month report", async () => {
        const response = await request(app)
            .get("/api/reports/monthly")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.period, "month_to_date");
        assert.equal(response.body.summary.total_readings, 2);
        assert.equal(response.body.summary.average, 110);
        assert.equal(response.body.readings.length, 2);
    });

    await t.test("should return previous month report", async () => {
        const response = await request(app)
            .get("/api/reports/previous-month")
            .set("Authorization", `Bearer ${token}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.period, "previous_month");
        assert.equal(response.body.summary.total_readings, 0);
        assert.equal(response.body.summary.highest, null);
        assert.equal(response.body.readings.length, 0);
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
