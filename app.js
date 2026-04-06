const express = require('express');
const path = require('path');
const app = express();
const itemsRoute = require('./routes/itemsRoute');

// mids
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/items', itemsRoute);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('home');
});

module.exports = app;

