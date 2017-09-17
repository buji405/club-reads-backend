
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
    table.string('goodreads_id').unique();
    table.string('avg_rating');
    table.string('ratings_count');
    table.string('image');
    table.integer('upvotes');
    table.integer('downvotes');
    table.string('status');``
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');
    table.integer('club_id').unsigned();
    table.foreign('club_id').references('club.id');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('vote', (table) => {
    table.increments('id').primary();
    table.string('direction');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');
    table.integer('book_id').unsigned();
    table.foreign('book_id').references('book.id');
    table.unique(['user_id', 'book_id']);

    table.timestamps(true, true);
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('vote'),
  knex.schema.dropTable('book'),
  knex.schema.dropTable('user'),
  knex.schema.dropTable('club'),
]);
