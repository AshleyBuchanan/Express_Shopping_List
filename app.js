const express = require('express');
const path = require('path');
const app = express();
let fakeDb = require('./db/fakeDb');

// mids
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/items', async (req, res) => {
    const items = await fakeDb.getAll();

    return res.json(items);
});

app.get('/items/:name', async (req, res) => {
    const name = req.params.name;
    const item = await fakeDb.get(name);

    return res.json(item);
});

app.post('/items', async (req, res) => {
    const item = req.body;
    await fakeDb.create(item);
    const message = {
        added: item
    };

    return res.json(message);
});

app.patch('/items/:name', async (req, res) => {
    const name = req.params.name;
    const n_name = req.body.name;
    const n_price = req.body.price;
    const updatedItem = {
        name: n_name,
        price: n_price
    };

    await fakeDb.update(name, updatedItem);

    const message = {
        updated: {
            requested: name,
            changedTo: updatedItem
        }
    };

    return res.json(message);
});

app.delete('/items/:name', async (req, res) => {
    const name = req.params.name;
    await fakeDb.delete(name);

    const message = {
        deleted: name
    }

    return res.json(message);
});

// listener
app.listen(3000, () => {
    console.log('listening on port 3000');
});

