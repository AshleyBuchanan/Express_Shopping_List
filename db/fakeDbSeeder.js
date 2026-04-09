const fs = require('fs/promises');
const path = require('path');
const { faker } = require('@faker-js/faker');

const LOG_FILE = path.join(__dirname, 'db_log.jsonl');
const FDB_FILE = path.join(__dirname, 'fakeDb.json');

console.log(faker.food.vegetable())
const seedFakeDb = async () => {
    for (let i = 0; i < 40; i++) {
        const item = {
        name: faker.food.vegetable(),
        price: faker.finance.amount({min: 0.99, max: 14.99})
        };

        try {
        const res = await fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        const data = await res.json();
        console.log(`Created:`, data);
        } catch (err) {
        console.error(`Error creating item ${i + 1}:`, err);
        };
    };
};

seedFakeDb();