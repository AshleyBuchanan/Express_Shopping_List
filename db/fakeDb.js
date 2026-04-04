const fs = require('fs/promises');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'db_log.jsonl');
const FDB_FILE = path.join(__dirname, 'fakeDb.json');

class FakeDb {
    constructor() {
        this.items = [];
        this.initialized = false;
    };

    async init() {

        try {
            const data = await fs.readFile(FDB_FILE, 'utf8');
            this.items = JSON.parse(data);
        } catch (err) {
            this.items = [];
            await this.persist();
            this.saveToLog('createdDB','init');
        };

        this.initialized = true;
    };

    async getAll() {
        await this.init();
        if (this.items.length === 0) return {message: 'no items stored'};

        await this.persist();
        await this.saveToLog('getAll', 'all items');
        return this.items;
    };

    async get(name) {
        await this.init();
        const item = this.items.find(item => item.name === name);
        if (!item) return {message: 'no item by that name'};

        await this.persist();
        await this.saveToLog('getOne', name);
        return item;
    };

    async create(item) {
        await this.init();

        this.items.push(item);
        await this.persist();
        await this.saveToLog('createOne', item.name);
        return item;
    };

    async update(name, updatedItem) {
        await this.init();
        const item = await this.get(name);
        if (!item) return {message: 'no item by that name'};
        if (updatedItem.name !== undefined) item.name = updatedItem.name;
        if (updatedItem.price !== undefined) item.price = updatedItem.price;

        Object.assign(item, updatedItem);
        await this.persist();
        await this.saveToLog('updateOne', name);
        return item;
    };

    async delete(name) {
        await this.init();
        const index = this.items.findIndex(item => item.name === name);
        if (index === -1) return {message: 'no item by that name'};

        const deleted = this.items.splice(index, 1)[0];
        await this.persist();
        await this.saveToLog('deleteOne', name);
        return deleted;
    };

    async saveToLog(op, name) {
        const record = {
            op: op,
            name: name,
            timeStamp: new Date().toISOString()
        };
        await fs.appendFile(LOG_FILE, `${JSON.stringify(record)}\n`, 'utf8');
    };

    async persist() {
        await fs.writeFile(FDB_FILE, JSON.stringify(this.items, null, 2), 'utf8')
    };
};

module.exports = new FakeDb();


// i only did this to demonstrate a single point of access.
// and to prevent the fakeDb from resetting... it was annoying.
// added a log file for db mutation as well.