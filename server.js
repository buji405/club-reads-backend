const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const app = express();
const port = (process.env.PORT || 3000);

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// ENDPOINTS

// Get the clubs so a new user can select which club to join
app.get('/api/v1/club', (request, response) => {
  database('club').select()
    .then((clubs) => {
      response.status(200).json(clubs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Login a user
// Sign up a new user
app.post('/api/v1/user/:action', (request, response) => {
  const newUser = request.body;
  const { email } = newUser;
  const { action } = request.params;

  if (action === 'login') {
    database('user').where({ email }).select()
      .then((user) => {
        if (!user.length) {
          throw new Error('User not found');
        }
        response.status(200).json({ user: user[0], message: 'login sucessful!' });
      })
      .catch((error) => {
        response.status(404).json({ error: error.message });
      });
  } else if (action === 'signup') {
    database('user').insert(newUser, '*')
      .then((user) => {
        response.status(201).json({ user, message: 'new user created!' });
      })
      .catch((error) => {
        response.status(500).json({ error: error.detail });
      });
  } else {
    response.status(500).json({ error: 'no endpoint found.' });
  }
});

// View all club books
app.get('/api/v1/book', (request, response) => {
  database('book').select()
    .then((books) => {
      response.status(200).json(books);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Add a new club
app.post('/api/v1/club', (request, response) => {
  const newClub = request.body;

  for (const requiredParamater of ['name']) {
    if (!newClub[requiredParamater]) {
      return response.status(422).json({
        error: `Missing required ${requiredParamater} parameter`,
      });
    }
  }

  database('club').insert(newClub, '*')
    .then((club) => {
      response.status(201).json(club[0]);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Add a new book to club books
app.post('/api/v1/book', (request, response) => {
  // Travis
});

// Add a vote
app.post('/api/v1/vote', (request, response) => {
  // Lindsay
  const newVote = request.body;

  for (const requiredParamater of ['user_id', 'book_id']) {
  // I think we need a 'direction' column, right?
  // for (const requiredParamater of ['user_id', 'book_id', 'direction']) {
    if (!newVote[requiredParamater]) {
      return response.status(422).json({
        error: `Missing required ${requiredParamater} parameter`
      });
    }
  }

  database('vote').insert(newVote, '*')
    .then((vote) => {
      response.status(201).json(vote[0]);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Delete a vote
app.delete('/api/v1/vote', (request, response) => {
  // Travi
});


app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

module.exports = app;
