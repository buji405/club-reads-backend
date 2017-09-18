const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = (process.env.PORT || 4000);

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const cors = require('express-cors');

app.use(cors({
  allowedOrigins: [
    'club-reads.herokuapp.com',
  ],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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

// Get data for a specific club
app.get('/api/v1/club/:id', (request, response) => {
  const { id } = request.params;

  database('club').where({ id }).select()
    .then((clubs) => {
      if (!clubs.length) {
        return response.status(404).json({ error: `A book club with the id ${id} was not found.` });
      }
      return response.status(200).json(clubs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Login a user          /api/v1/user/login
// Sign up a new user    /api/v1/user/signup
app.post('/api/v1/user/:action', (request, response) => {
  const newUser = request.body;
  const { email } = newUser;
  const { action } = request.params;

  const requiredLoginParamaters = [
    'email',
  ];

  for (let i = 0; i < requiredLoginParamaters.length; i += 1) {
    const param = requiredLoginParamaters[i];
    if (!newUser[param]) {
      return response.status(422).json({ error: `Missing required ${param} parameter` });
    }
  }

  if (action === 'login') {
    database('user').where({ email }).select()
      .then((user) => {
        if (!user.length) {
          throw new Error('User not found');
        }
        response.status(200).json({ user: user[0], message: 'login sucessful!' });
      })
      .catch((error) => {
        response.status(422).json({ error: error.message });
      });
  } else if (action === 'signup') {
    const requiredSignupParamaters = [
      'email',
      'club_id',
    ];

    for (let i = 0; i < requiredSignupParamaters.length; i += 1) {
      const param = requiredSignupParamaters[i];
      if (!newUser[param]) {
        return response.status(422).json({ error: `Missing required ${param} parameter` });
      }
    }

    database('user').insert(newUser, '*')
      .then((user) => {
        response.status(201).json({ user: user[0], message: 'new user created!' });
      })
      .catch((error) => {
        response.status(500).json({ error: error.detail });
      });
  } else {
    response.status(500).json({ error: 'no endpoint found.' });
  }
});

// View all club books (or with query parameter)
app.get('/api/v1/book', (request, response) => {
  database('book').where('club_id', request.query.club_id).select()
    .then((books) => {
      response.status(200).json(books);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Update book information
app.patch('/api/v1/book', (request, response) => {
  const { id, status } = request.query;
  const { direction, newStatus, newUpdatedAt } = request.body;
  const dbValue = !id ? 'status' : 'id';
  const reqValue = !id ? status : id;

  if (direction) {
    database('book').where('id', id)
      .select()
      .increment(`${direction}votes`, '*')
      .then((quantity) => {
        if (quantity === 0) {
          throw new Error('Update failed, check request body');
        }
        response.status(204).end();
      })
      .catch((error) => {
        response.status(500).json({ error: error.message });
      });
  } else {
    database('book')
      .where(dbValue, reqValue)
      .update({
        status: newStatus,
        updated_at: newUpdatedAt,
      }, '*')
      .then((result) => {
        if (result === 0) {
          throw new Error('Update failed, check request body');
        }
        response.status(204).end();
      })
      .catch((error) => {
        response.status(500).json({ error: error.message });
      });
  }
});

// Add a new club
app.post('/api/v1/club', (request, response) => {
  const newClub = request.body;
  const requiredParamaters = ['name'];

  for (let i = 0; i < requiredParamaters.length; i += 1) {
    const param = requiredParamaters[i];
    if (!newClub[param]) {
      return response.status(422).json({ error: `Missing required ${param} parameter` });
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
  const newBook = Object.assign(request.body, {
    upvotes: 0,
    downvotes: 0,
    status: 'suggested',
  });

  const requiredParamaters = [
    'title',
    'author',
    'goodreads_id',
    'image',
    'user_id',
    'club_id',
    'avg_rating',
    'ratings_count',
  ];

  for (let i = 0; i < requiredParamaters.length; i += 1) {
    const param = requiredParamaters[i];
    if (!newBook[param]) {
      return response.status(422).json({ error: `Missing required ${param} parameter` });
    }
  }

  database('book').insert(newBook, '*')
    .then((book) => {
      response.status(201).json(book[0]);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Add a vote
app.post('/api/v1/vote', (request, response) => {
  const newVote = request.body;
  const requiredParamaters = ['direction', 'user_id', 'book_id'];

  for (let i = 0; i < requiredParamaters.length; i += 1) {
    const param = requiredParamaters[i];
    if (!newVote[param]) {
      return response.status(422).json({ error: `Missing required ${param} parameter` });
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
app.delete('/api/v1/vote/:id', (request, response) => {
  database('vote')
    .where('id', request.params.id)
    .del('*')
    .then((vote) => {
      if (vote.length) {
        response.status(200).json({ vote });
      } else {
        response.status(404).json({
          error: 'No vote data exists for that id'
        });
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// Edit vote
app.patch('/api/v1/vote/:id', (request, response) => {
  const newVote = request.body;
  const requiredParamaters = ['direction'];

  for (let i = 0; i < requiredParamaters.length; i += 1) {
    const param = requiredParamaters[i];
    if (!newVote[param]) {
      return response.status(422).json({ error: `Missing required ${param} parameter` });
    }
  }

  database('vote')
    .where('id', request.params.id)
    .update(newVote, '*')
    .then((vote) => {
      if (vote.length) {
        response.status(201).json({ vote });
      } else {
        response.status(404).json({
          error: 'No vote data exists for that id',
        });
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

module.exports = app;
