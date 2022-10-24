// REQUIRED / DEPENDENCIES //
const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const getPath = (name) => path.join(__dirname, '..', 'public', `${name}.html`);
// GET NOTES PAGE //
// request the notes page
router.get('/taconotes', (req, res) => {
    res.sendFile(getPath('taconotes'));
});

// GET INDEX PAGE //
// requests the index page
router.get('/tacoindex', (req, res) => {
    res.sendFile(getpath('tacoindex'));
});
   
// NO ROUTE / NO PROBLEM //
// if there's no route, it redirects to index
router.get('*', (req, res) => {
    res.sendFile(getPath("tacoindex"));
});

module.exports = router;