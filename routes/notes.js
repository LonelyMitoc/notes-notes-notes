const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET route to retrieve all notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET route for a specific notes via id
notes.get('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((notes) => notes.notes_id === notesId);
      return result.length > 0
        ? res.json(result)
        : res.json('No notes with the input ID');
    });
});

// DELETE route for a specific notes
notes.delete('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // create new array of all notes except the one from the URL
      const result = json.filter((notes) => notes.notes_id !== notesId);

      // Save array to the file system
      writeToFile('./db/db.json', result);

      // Respond to DELETE request
      res.json(`Notes ${notesId} has been deleted 🗑️`);
    });
});

// POST route for new notes
notes.post('/', (req, res) => {
  console.log(req.body);

  const { notesTitle, notes } = req.body;

  if (req.body) {
    const newNotes = {
      notesTitle,
      notes,
      notes_id: uuidv4(),
    };

    readAndAppend(newNotes, './db/db.json');
    res.json(`Notes added successfully`);
  } else {
    res.errored('Error in adding notes');
  }
});

module.exports = notes;