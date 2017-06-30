exports.up = function(knex, Promise){
  return Promise.all([

    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary();
      table.string('name').unique();

      table.timestamps(true, true);
    }),

    knex.schema.createTable('links', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('long_url');
      table.string('short_url');
      table.integer('clicks');
      table.integer('folders_id').unsigned();
      table.foreign('folders_id').references('folders.id');

      table.timestamps(true, true);
    })
  ])
}

exports.down = function(knex, Promise){
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders')
  ])
}
