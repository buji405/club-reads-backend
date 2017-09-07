
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('club', (table) => {
    table.increments('id').primary();
    table.string('name').unique();

    table.timestamps(true, true);
  }),

  knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('email').unique();
    table.integer('club_id').unsigned();
    table.foreign('club_id').references('club.id');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('book', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.string('author');
    table.string('ISBN').unique();
    table.string('description');
    table.string('image');
    table.integer('upvotes');
    table.integer('downvotes');
    table.string('status');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('vote', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');
    table.integer('book_id').unsigned();
    table.foreign('book_id').references('book.id');

    table.timestamps(true, true);
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('club'),
  knex.schema.dropTable('user'),
  knex.schema.dropTable('book'),
  knex.schema.dropTable('vote'),
]);
