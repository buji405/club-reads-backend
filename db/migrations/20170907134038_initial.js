
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('clubs', (table) => {
    table.increments('id').primary();
    table.string('name');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email');
    table.integer('club_id').unsigned();
    table.foreign('club_id').references('clubs.id');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.string('author');
    table.string('isbn');
    table.string('description');
    table.string('image');
    table.integer('upvotes');
    table.integer('downvotes');
    table.string('status');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('votes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
    table.integer('book_id').unsigned();
    table.foreign('book_id').references('books.id');

    table.timestamps(true, true);
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('clubs'),
  knex.schema.dropTable('users'),
  knex.schema.dropTable('books'),
  knex.schema.dropTable('votes'),
]);
