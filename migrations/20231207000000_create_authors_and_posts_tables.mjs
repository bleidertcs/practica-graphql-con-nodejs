export async function up(knex) {
  await knex.schema.createTable('authors', (table) => {
    table.increments('id').primary();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email', 255);
    table.date('birthdate');
    table.datetime('added').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.integer('author_id').unsigned().notNullable();
    table.text('description');
    table.text('content');
    table.datetime('date').defaultTo(knex.fn.now());

    table.foreign('author_id').references('id').inTable('authors').onDelete('CASCADE');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('authors');
}
