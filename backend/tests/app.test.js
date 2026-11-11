
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET / should return the welcome message", async () => {
    const response = await request(app).get("/");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.message, "Welcome to Sweety API");
});
