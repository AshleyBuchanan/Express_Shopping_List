const fs = require('fs/promises');
const path = require('path');
const express = require('express');
let router = express.Router();
let fakeDb = require('../db/fakeDb');

const filePath = path.join(__dirname, '../db/db_log.jsonl');

async function getLogs() {
  const logs = await fs.readFile(filePath, 'utf-8');

  return logs
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));
};

// '/interface/' routes
router.route('/list').get(async (req, res) => {
    console.log('arrived')
    const items = await fakeDb.getAll();
    const safeArray = Array.isArray(items) ? items : [items.message];

    return res.render('index', { file: 'list', array: safeArray });
});

router.route('/logs').get(async (req, res) => {
    const items = await getLogs();
    console.log(items)
    const safeArray = Array.isArray(items) ? items : [items.message];

    return res.render('index', { file: 'logs', array: safeArray });
});

router.route('/about').get(async (req, res) => {
    const items = await fakeDb.getAll();
    const safeArray = Array.isArray(items) ? items : [items.message];

    return res.render('index', { file: 'about', array: safeArray });
});

router.route('/').get((req, res) => {
    return res.redirect('/interface/list');
});

router.get('/*splat', (req, res) => {
    return res.redirect('/interface/list');
});

module.exports = router;
