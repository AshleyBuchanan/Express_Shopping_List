// jest tests
const fakeDb = require('../db/fakeDb');

describe('fakeDb', () => {
    beforeEach(async () => {
        await fakeDb.deleteAll();
    });

    test('deleteAll returns deleted message', async () => {
        const result = await fakeDb.deleteAll();
        expect(result).toEqual({ deleted: 'all items' });
    });

    test('getAll returns no items message when empty', async () => {
        const result = await fakeDb.getAll();
        expect(result).toEqual({ message: 'no items stored' });
    });

    test('create adds an item', async () => {
        const item = await fakeDb.create({ name: 'jerky', price: 5.99 });

        expect(item).toEqual(
        expect.objectContaining({
            name: 'jerky',
            price: 5.99,
            id: expect.any(String)
        })
        );
    });

    test('getAll returns created items', async () => {
        await fakeDb.create({ name: 'jerky', price: 5.99 });
        await fakeDb.create({ name: 'milk', price: 3.49 });

        const result = await fakeDb.getAll();

        expect(result).toHaveLength(2);
        expect(result).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'jerky', price: 5.99 }),
            expect.objectContaining({ name: 'milk', price: 3.49 })
        ])
        );
    });

    test('get returns all matching items by name', async () => {
        await fakeDb.create({ name: 'jerky', price: 5.99 });
        await fakeDb.create({ name: 'jerky', price: 7.99 });

        const result = await fakeDb.get('jerky');

        expect(result).toHaveLength(2);
        expect(result).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'jerky', price: 5.99 }),
            expect.objectContaining({ name: 'jerky', price: 7.99 })
        ])
        );
    });

    test('update changes one item by id', async () => {
        const item = await fakeDb.create({ name: 'jerky', price: 5.99 });

        const result = await fakeDb.update(item.id, { price: 6.99 });

        expect(result).toEqual({
        updated: [
            expect.objectContaining({
            id: item.id,
            name: 'jerky',
            price: 6.99
            })
        ]
        });
    });

    test('delete removes one item by id', async () => {
        const item = await fakeDb.create({ name: 'jerky', price: 5.99 });

        const result = await fakeDb.delete(item.id);

        expect(result).toEqual({
        deleted: expect.objectContaining({
            id: item.id,
            name: 'jerky',
            price: 5.99
        })
        });

        const allItems = await fakeDb.getAll();
        expect(allItems).toEqual({ message: 'no items stored' });
    });
    });

    test('findNameOrId returns id when given a UUID string', () => {
    const result = fakeDb.findNameOrId('12345678-1234-1234-1234-123456789012');

    expect(result).toEqual({
        id: '12345678-1234-1234-1234-123456789012',
        name: null
    });
    });

    test('findNameOrId returns name when given a normal item name', () => {
    const result = fakeDb.findNameOrId('jerky');

    expect(result).toEqual({
        id: null,
        name: 'jerky'
    });
});

