const express = require('express');
let router = express.Router();
let fakeDb = require('../db/fakeDb');

// '/items/' route
router.route('/')
    .get(async (req, res) => {
        const items = await fakeDb.getAll();

        return res.json(items);
    })

    .post(async (req, res) => {
        const item = req.body;
        await fakeDb.create(item);
        const message = {
            added: item
        };

        return res.json(message);
});

router.route('/:name')
    .get( async (req, res) => {
        const name = req.params.name;
        const item = await fakeDb.get(name);

        return res.json(item);
    })

    .patch(async (req, res) => {
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
    })

    .delete(async (req, res) => {
        const name = req.params.name;
        await fakeDb.delete(name);

        const message = {
            deleted: name
        }

        return res.json(message);
});

module.exports = router;