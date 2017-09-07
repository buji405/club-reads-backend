const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const app = express();
const port = (process.env.PORT || 3000);

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// ENDPOINTS

// Get the clubs so a new user can select which club to join
app.get('/api/v1/club', (request, response) => {
  database('club').select()
    .then((club) => {
      response.status(200).json(club);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Sign up a new user
app.post('/api/v1/user', (request, response) => {

});

// Login a user
app.post('/api/v1/user', (request, response) => {

});

// View all club books
app.get('/api/v1/book', (request, response) => {
  database('book').select()
    .then((book) => {
      response.status(200).json(book);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Add a new book to club books
app.post('/api/v1/book', (request, response) => {

});

// Add a vote
app.post('/api/v1/vote', (request, response) => {

});

// Delete a vote
app.delete('/api/v1/vote', (request, response) => {

});

// Get all comments
app.get('/api/v1/comment', (request, response) => {
  database('comment').select()
    .then((comment) => {
      response.status(200).json(comment);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Edit comment
app.patch('/api/v1/comment', (request, response) => {

});

// Post a comment
app.post('/api/v1/comment', (request, response) => {

});

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

module.exports = app;
