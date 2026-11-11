
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const pool = require("../src/config/database");
const app = require("../src/app");

const testEmail = `sweety-test-${Date.now()}@example.com`;

test("Authentication API", async (t) => {
    await t.test("should reject registration with missing fields", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User"
            });

        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    await t.test("should register a new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Sweety Test User",
                email: testEmail,
                password: "TestPass123"
            });

        assert.equal(response.status, 201);
        assert.equal(response.body.success, true);
        assert.ok(response.body.token);
        assert.equal(response.body.user.email, testEmail);
    });

    await t.test("should reject duplicate registration", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Sweety Test User",
                email: testEmail,
                password: "TestPass123"
            });

        assert.equal(response.status, 409);
        assert.equal(response.body.success, false);
    });

    await t.test("should reject incorrect login credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: "WrongPassword123"
            });

        assert.equal(response.status, 401);
        assert.equal(response.body.success, false);
    });

    await t.test("should login successfully with correct credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: "TestPass123"
            });

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.ok(response.body.token);
    });

    await t.test("should reject login with missing credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail
            });

        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    await t.after(async () => {
        await pool.query(
            "DELETE FROM users WHERE email = $1",
            [testEmail]
        );
    });
});
