const express = require('express');
const path = require('path');
const app = express();
const itemsRoute = require('./routes/itemsRoute');
const interfaceRoute = require('./routes/interfaceRoute');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/items', itemsRoute);
app.use('/interface', interfaceRoute);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.redirect('/interface/list');
});

module.exports = app;

