// REQUIRED / DEPENDENCIES //
const express = require('express');
const uuid = require('uuid');
const router = express.Router();

let data = require('../db/db.json');
// GET //
router.get('/', (req, res) => res.json(data));
// POST //
router.post('/', (req, res) => {
    const newTitle = req.body.title;
    const newText = req.body.text;
    // adds warning that you must add a new title and text
    console.log(newText, newTitle)
    if (!newTitle || !newText) {
        res.status(400).json({msg: 'You must enter both Title and Text for Best Taco Results.'})
    } else {
        const newJSON = {
            id: uuid.v4(),
            title: newTitle,
            text: newText
        };
        data.push(newJSON);
        res.json(data);
    };
});
// DELETE //
router.delete('/:id', (req, res) => {
    const found = data.some(obj => obj.id === req.params.id);
    if (found) {
        data = data.filter(obj => obj.id !== req.params.id);
        res.json(data);
    } else {
        res.status(400).json(data);
    };
});

module.exports = router;