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

    async get(nameOrId) {        
        await this.init();

        const {id, name} = this.findNameOrId(nameOrId);
        let item = null;
        if (name !== null) {
            item = this.items.filter(item => item.name === name);
        } else {
            item = this.items.filter(item => item.id === id);
        };
        if (item.length===0) return {message: 'no item by that name'};


        await this.persist();
        await this.saveToLog('getOne', name);
        return item;
    };

    async create(item) {
        await this.init();
        item.id = crypto.randomUUID();
        this.items.push(item);
        await this.persist();
        await this.saveToLog('createOne', item.name);
        return item;
    };

    async update(nameOrId, updatedItem) {
        await this.init();

        const {id, name} = this.findNameOrId(nameOrId);
        let item;
        if (name !== null) {
            item = this.items.filter(item => item.name === name);
        } else {
            item = this.items.filter(item => item.id === id);
        };
        if (item.length > 1)   return {message: 'cannot modify more than one of the same name'};
        if (item.length === 0) return {message: 'no item by that name'};

        //if (updatedItem.name  !== undefined) item[0].name  = updatedItem.name;
        //if (updatedItem.price !== undefined) item[0].price = updatedItem.price;

        Object.assign(item[0], updatedItem);
        
        await this.persist();
        await this.saveToLog('updateOne', item[0].name);
        return {updated: item};
    };

    async delete(nameOrId) {
        await this.init();

        const {id, name} = this.findNameOrId(nameOrId);
        let item, index;
        if (name !== null) {
            item = this.items.filter(item => item.name === name);
            index = this.items.findIndex(item => item.name === name);
        } else {
            item = this.items.filter(item => item.id === id);
            index = this.items.findIndex(item => item.id === id);
        };
        if (item.length > 1)   return {message: 'cannot delete more than one of the same name'};
        if (item.length === 0) return {message: 'no item by that name'};
        
        const deleted = this.items.splice(index, 1)[0];
        
        await this.persist();
        await this.saveToLog('deleteOne', item[0].name);

        return {deleted: deleted};
    };

    async deleteAll() {
        await this.init();

        this.items = [];

        await this.persist();
        await this.saveToLog('deleteAll', 'all items');

        return { deleted: 'all items' };
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

    findNameOrId(nameOrId) {
        if (nameOrId.length === 36 ) return {id: nameOrId, name: null}
        return {id: null, name: nameOrId}
    };
};

module.exports = new FakeDb();


// i only did this to demonstrate a single point of access.
// and to prevent the fakeDb from resetting... it was annoying.
// added a log file for db mutation as well.

// funny. the further study has me doing the json db thing. :D

// there are seemingly redundant filter and findIndex. It's intentional
// to identify is more than one item of the same name exist beforehand,
// then delete the requested item only if there's one.