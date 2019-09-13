
exports.up = knex => knex.schema.createTable('services', (t) => {
  t.increments('id').primary();
  t.string('description').notNull();
  t.decimal('price', 14, 2).notNull();
  t.timestamps();
});

exports.down = knex => knex.schema.dropTable('services');
