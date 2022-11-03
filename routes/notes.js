// Import necessary paths
const notes = require('express').Router();
const fs = require('fs');
const { notesArr } = require('../db/db.json');
// Helper method for generating unique IDs from node.js
const { v4: uuidv4 } = require('uuid');

// GET request to retrieve all data from db.json
notes.get('/', (req, res) => {
  // Log the request to the terminal with the method
  console.info(`${req.method} request method received to get notes`);

  res.json(notesArr);
});


// POST request to add new note to the db
notes.post('/', (req, res) => {
  console.info(`${req.method} request method received to add a note`);

  // Destructure req.body into constants
  const { title, text } = req.body;

  if (title && text) {
    // Const for the values being added to the notesArr in db
    const newNotes = {
      title,
      text,
      id: uuidv4(),
    };

    // Adding a new object to the notesArr to overwrite the current db in the next step
    notesArr.push(newNotes);

    // Write updated notesArr back to the db
    fs.writeFile('./db/db.json', JSON.stringify({ notesArr: notesArr }, null, 4), (err) => {
      err ? console.error('Error in adding note; something wrong with adding to json file') : console.log('Note added');
    });

    // Response to show in console and POST results
    const response = {
      status: 'Success!',
      body: newNotes,
    };
    console.log(response);
    res.json(response);

    // worked backwards from a helper method
    // readAndAppend(newNotes, './db/db.json'); 
  } else {
    res.json('Error in adding note; please check input is filled');
  }
});

// DELETE method to delete a particular note based on the id (when the trash can icon is pressed)
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  // For loop to check each note's id to match with the trash can icon input from the website 
  for (let i = 0; i < notesArr.length; i++) {
    const checkNote = notesArr[i];
    // If the id matches, remove the specific note from the array
    if (checkNote.id === req.params.id) {
      let index = notesArr.indexOf(checkNote);
      notesArr.splice(index, 1);

      // Write updated notesArr back to the db
      fs.writeFile('./db/db.json', JSON.stringify({ notesArr: notesArr }, null, 4), (err) => {
        err ? console.error('Error in deleting note') : console.log('Note deleted');
      });

      res.json();
      return;

      // worked backwards from a helper method
      // readFromFile('./db/db.json')
      //   .then((data) => JSON.parse(data))
      //   .then((json) => {
      // create new array of all notes except the one from the URL
      //     const result = json.filter((note) => note.notes_id !== notesId);

      // Save array to the file system
      //     writeToFile('./db/db.json', result);
    }
  }
  res.json('Please check that the note or note ID exists');
});

module.exports = notes;