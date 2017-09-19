const club = [
  {
    name: 'Turing',
  },
  {
    name: '1703 FrontEnd',
  },
];

const user = [
  {
    email: 'travis@email.com',
    club_id: 1,
  },
  {
    email: 'lindsay@email.com',
    club_id: 1,
  },
  {
    email: 'ciara@email.com',
    club_id: 2,
  },
  {
    email: 'dave@email.com',
    club_id: 2,
  },
];

const book = [
  {
    title: 'Fantasy Book',
    author: 'George R.R. Martin',
    goodreads_id: '12345',
    image: 'https://images.gr-assets.com/books/1436732693l/13496.jpg',
    upvotes: '1',
    downvotes: '1',
    status: 'read',
    user_id: 1,
    club_id: 1,
    avg_rating: 3.86,
    ratings_count: 1000,
  },
  {
    title: 'Muder/Mystery Book',
    author: 'Stieg Larsson',
    goodreads_id: '45678',
    image: 'https://images.gr-assets.com/books/1327868566l/2429135.jpg',
    upvotes: '0',
    downvotes: '1',
    status: 'reading',
    user_id: 2,
    club_id: 1,
    avg_rating: 2.77,
    ratings_count: 1000,
  },
  {
    title: 'Horror Book',
    author: 'Stephen King',
    goodreads_id: '67890',
    image: 'https://images.gr-assets.com/books/1334416842l/830502.jpg',
    upvotes: '2',
    downvotes: '0',
    status: 'suggested',
    user_id: 4,
    club_id: 1,
    avg_rating: 4.81,
    ratings_count: 1000,
  },
];

const vote = [
  {
    direction: 'down',
    user_id: 2,
    book_id: 1,
  },
  {
    direction: 'up',
    user_id: 1,
    book_id: 1,
  },
  {
    direction: 'down',
    user_id: 1,
    book_id: 2,
  },
  {
    direction: 'up',
    user_id: 3,
    book_id: 3,
  },
  {
    direction: 'up',
    user_id: 4,
    book_id: 3,
  },
];

exports.seed = (knex, Promise) => {
  return knex('vote').del()
    .then(() => knex('book').del())
    .then(() => knex('user').del())
    .then(() => knex('club').del())
    .then(() => {
      return Promise.all(club.map((club) => {
        return knex('club').insert(club);
      }));
    })
    .then(() => {
      return Promise.all(user.map((user) => {
        return knex('user').insert(user);
      }));
    })
    .then(() => {
      return Promise.all(book.map((book) => {
        return knex('book').insert(book);
      }));
    })
    .then(() => {
      return Promise.all(vote.map((vote) => {
        return knex('vote').insert(vote);
      }));
    })
    .then(() => {
      console.log('Re-seeding Complete');
    })
    .catch(() => {
      console.log({ error: 'Error seeding data' });
    });
};
