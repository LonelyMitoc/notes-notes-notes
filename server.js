// Import express
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form datas
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

// GET route for the homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for the note taking page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct to 404 page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/404page.html'))
);

// To start the hosting
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 💻`)
);