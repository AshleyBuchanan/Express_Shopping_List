const express = require('express');
let router = express.Router();
let fakeDb = require('../db/fakeDb');

// '/items/' route
router.route('/')
    .get(async (req, res) => {
        const items = await fakeDb.getAll();

        return res.status(200).json(items);
    })

    .post(async (req, res) => {
        const item = req.body;
        await fakeDb.create(item);
        const message = {
            added: item
        };

        return res.status(201).json(message);
});

router.route('/:nameOrId')
    .get( async (req, res) => {
        const nameOrId = req.params.nameOrId;
        const item = await fakeDb.get(nameOrId);

        return res.json(item);
    })

    .patch(async (req, res) => {
        const nameOrId = req.params.nameOrId;
        const n_name = req.body.name;
        const n_price = req.body.price;
        const updatedItem = {
            name: n_name,
            price: n_price
    };

        let message = await fakeDb.update(nameOrId, updatedItem);
        return res.json(message);
    })

    .delete(async (req, res) => {
        const nameOrId = req.params.nameOrId;
        let message = await fakeDb.delete(nameOrId);
        return res.json(message);
});

module.exports = router;