// const notes = require('express').Router();
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const { noteDb } = require('../db/db.json');
// // const {
// //   readFromFile,
// //   readAndAppend,
// //   writeToFile,
// // } = require('../helpers/fsUtils');

// // GET route to retrieve all notes
// notes.get('/', (req, res) => {
//   console.info(`${req.method} request method received to retrieve notes`);
  
//   res.status(200).json(noteDb);
//   // readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
// });


// // POST route for new notes
// notes.post('/', (req, res) => {
//   console.info(`${req.method} request method received to add notes`);

//   const { notesTitle, text } = req.body;

//   if (notesTitle && text) {
//     const newNotes = {
//       notesTitle,
//       text,
//       notes_id: uuidv4(),
//     };

//     noteDb.push(newNotes);
    
//     fs.writeFile('./db/db.json', JSON.stringify({noteArr: noteDb}, null, 4), (err) => {
//       err ? console.error('Error in adding note') : console.log('Note added');
//     });

//     // readAndAppend(newNotes, './db/db.json');
//     console.log(newNotes);
//     res.json(`Notes added successfully`);

//   } else {

//     res.json('Error in adding notes');

//   }
// });

// // DELETE route for a specific notes_id
// notes.delete('/:notes_id', (req, res) => {
//   console.info(`${req.method} method request received for deleting a note`);
//   const notesId = req.params.notes_id;

//   for ( let i = 0; i < noteDb.length; i++) {
//     const checkNote = noteDb[i];
//     if (checkNote.notes_id === notesId) {
//       let index = noteDb.indexOf(checkNote);
//       noteDb.splice(index, 1);

//       fs.writeFile('./db/db.json', JSON.stringify({noteArr: noteDb}, null, 4), (err) => {
//         err ? console.error('Error in deleting note') : console.log('Note deleted');
//       });

//       res.json(`Notes ${notesId} has been deleted 🗑️`);
//       return;
//     }
//   }
//   res.json('Note ID not found')

//   // readFromFile('./db/db.json')
//   //   .then((data) => JSON.parse(data))
//   //   .then((json) => {
//   //     // create new array of all notes except the one from the URL
//   //     const result = json.filter((note) => note.notes_id !== notesId);

//   //     // Save array to the file system
//   //     writeToFile('./db/db.json', result);

//   //     // Respond to DELETE request
//       // res.json(`Notes ${notesId} has been deleted 🗑️`);
//     // });
// });


// module.exports = notes;

const notes = require('express').Router();
const fs = require('fs');
const { notesArr } = require('../db/db.json');
// Helper method for generating unique IDs
const { v4: uuidv4 } = require('uuid');

// GET request to retrieve all data from db.json
notes.get('/', (req, res) => {
    // Log the request to the terminal with the method
    console.info(`${req.method} request method received to get notes`);

    res.json(notesArr);
});


// POST request to add new note to the db
notes.post('/', (req, res) => {
    // Log the request to the terminal with the method
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

    } else {
        res.json('Error in adding note; please check input is filled');
    }
});

// DELETE method to delete a particular note based on the id (when the trash can icon is pressed)
notes.delete('/:id', (req, res) => {
    // Log request to the terminal
    console.info(`${req.method} request received to delete a note`);

    // Searching the database for the note who's ID matches the note clicked on the front-end 
    for (let i = 0; i < notesArr.length; i++) {
        const checkNote = notesArr[i];
        // If the ID matches, remove it from the database
        if (checkNote.id === req.params.id) {
            let index = notesArr.indexOf(checkNote);
            notesArr.splice(index, 1);

            // Write updated notes back to the db
            fs.writeFile('./db/db.json', JSON.stringify({ notesArr: notesArr }, null, 4), (err) => {
            err ? console.error('Error in deleting note') : console.log('Note deleted');
            });
    
            res.json();
            return;
        } 
    }
    res.json('Note ID not found');
});

module.exports = notes;