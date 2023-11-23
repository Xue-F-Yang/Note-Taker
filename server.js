const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));
app.use(express.json());

app.get('/api/notes', (req, res, next) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            next(err);
        } else {
            let dbData = JSON.parse(data);
            res.json(dbData);
        }
    });   
});

app.post('/api/notes', (req, res, next) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) {
            next(err);
        } else {
            res.json(newNote);
        }
    });
});

app.delete('/api/notes/:id', (req, res, next) => {
    const newDb = db.filter((note) => note.id !== req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(newDb), (err) => {
        if (err) {
            next(err);
        } else {
            res.json(newDb);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.disable('x-powered-by');

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});