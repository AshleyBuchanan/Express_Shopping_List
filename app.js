const express = require('express');
const path = require('path');
const app = express();
const fakeDb = require('./db/fakeDb');

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

app.get('/items', (req, res) => {
    const items = [...fakeDb];
    return res.json(items);
});

app.post('/items', (req, res) => {
    const items = req.body;
    fakeDb.push(items);
    const message = {
        added: items
    };
    return res.json(message);
});

app.get('/items/:name', (req, res) => {
    const name = req.params.name;
    const item = fakeDb.find(n => n.name === name);
    return res.json(item);
});

app.patch('/items/:name', (req, res) => {

});

app.delete('/items/:name', (req, res) => {

});

// listener
app.listen(3000, () => {
    console.log('listening on port 3000');
});

