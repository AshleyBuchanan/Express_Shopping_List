// superset tests

const request = require('supertest');
const app = require('../app');
const fakeDb = require('../db/fakeDb');

afterEach(async () => {
    await fakeDb.deleteAll();
});

describe('POST /items', () => {
    test('creates a new item', async () => {
        const resp = await request(app)
            .post('/items')
            .send({ name: 'apple', price: 1.50 });

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            added: expect.objectContaining({
                id: expect.any(String),
                name: 'apple',
                price: 1.50
            })
        })
    });

    test('GET /items/:nameOrId returns matching items', async () => {
        await fakeDb.create({ name: 'jerky', price: 5.99 });
        await fakeDb.create({ name: 'jerky', price: 7.99 });
        await fakeDb.create({ name: 'milk', price: 3.49 });

        const resp = await request(app).get('/items/jerky');

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'jerky', price: 5.99, id: expect.any(String) }),
                expect.objectContaining({ name: 'jerky', price: 7.99, id: expect.any(String) })
            ])
        );
        expect(resp.body).toHaveLength(2);
    });

    test('PATCH /items/:nameOrId updates item', async () => {
        const item = await fakeDb.create({ name: 'jerky', price: 5.99 });

        const resp = await request(app)
            .patch(`/items/${item.id}`)
            .send({ price: 6.99 });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(
            expect.objectContaining({
                updated: expect.anything()
            })
        );
    });

    test('DELETE /items/:nameOrId deletes item', async () => {
        const item = await fakeDb.create({ name: 'jerky', price: 5.99 });

        const resp = await request(app)
            .delete(`/items/${item.id}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(
            expect.objectContaining({
                deleted: expect.anything()
            })
        );

        const allItems = await fakeDb.getAll();
        expect(allItems).toEqual({ message: 'no items stored' });
    });
});