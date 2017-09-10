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
