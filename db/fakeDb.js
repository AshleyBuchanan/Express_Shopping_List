const fs = require('fs/promises');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'db_log.jsonl');

class FakeDb {
    constructor() {
        this.items = [
        {
            name: 'popsicle',
            price: 1.45,
        },
        {
            name: 'cheerios',
            price: 3.40,
        },
        ];
    };

    async getAll() {
        if (this.items.length === 0) return {message: 'no items stored'};

        await this.saveToLog({
            op: 'getAll',
            name: 'all items',
            timeStamp: new Date().toISOString()
        });

        return this.items;
    };

    async get(name) {
        const item = this.items.find(item => item.name === name);
        if (!item) return {message: 'no item by that name'};

        await this.saveToLog({
            op: 'getOne',
            name: name,
            timeStamp: new Date().toISOString()
        });

        return item;
    };

    async create(item) {
        await this.saveToLog({
            op: 'createOne',
            name: item.name,
            timeStamp: new Date().toISOString()
        });

        this.items.push(item);
        return item;
    };

    async update(name, updatedItem) {
        const item = this.get(name);
    
        if (!item) return {message: 'no item by that name'};
        if (updatedItem.name !== undefined) item.name = updatedItem.name;
        if (updatedItem.price !== undefined) item.price = updatedItem.price;

        await this.saveToLog({
            op: 'updateOne',
            name: name,
            timeStamp: new Date().toISOString()
        });

        return item;
    };

    async delete(name) {
        const index = this.items.findIndex(item => item.name === name);

        if (index === -1) return {message: 'no item by that name'};

        await this.saveToLog({
            op: 'deleteOne',
            name: name,
            timeStamp: new Date().toISOString()
        });
        return this.items.splice(index, 1)[0];
    };

    saveToLog = async (record) => {
        await fs.appendFile(LOG_FILE, `${JSON.stringify(record)}\n`, 'utf8');
    };
};

module.exports = new FakeDb();


// i only did this to demonstrate a single point of access.
// and to prevent the fakeDb from resetting.