const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = (process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// ENDPOINTS

// Get the clubs so a new user can select which club to join
app.get('/api/v1/club', () => {

})

// Sign up a new user
app.post('/api/v1/user', () => {

})

// Login a user
app.post('/api/v1/user', () => {

})

// View all club books
app.get('/api/v1/book', () => {

})

// Add a new book to club books
app.post('/api/v1/book', () => {

})

// Add a vote
app.post('/api/v1/vote', () => {

})

// Delete a vote
app.delete('/api/v1/vote', () => {

})

// Get all comments
app.get('/api/v1/comment', () => {

})

// Edit comment
app.patch('/api/v1/comment', () => {

})

// Post a comment
app.post('/api/v1/comment', () => {

})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

module.exports = app;
