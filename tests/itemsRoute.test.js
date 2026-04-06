// superset tests

const request = require('supertest');
const app = require('../app');

test("GET /items returns all items", async () => {
    const resp = await request(app).get("/items");

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Object));
});

test("GET /items returns all items", async () => {
    const resp = await request(app).get("/items");

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Object));
});