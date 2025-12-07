import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('authors', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.datetime('birthdate').notNullable();
    table.datetime('added').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('author_id').unsigned().notNullable();
    table.foreign('author_id').references('id').inTable('authors');
    table.string('description');
    table.text('content');
    table.datetime('date').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('authors');
}