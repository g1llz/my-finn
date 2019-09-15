
exports.up = knex => knex.schema.createTable('orders', (t) => {
  t.increments('id').primary();
  t.integer('user_id').references('id').inTable('users').notNull();
  t.integer('service_id').references('id').inTable('services').notNull();
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTable('orders');
