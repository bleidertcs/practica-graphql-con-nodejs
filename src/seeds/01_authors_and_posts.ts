import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('posts').del();
    await knex('authors').del();

    // Inserts seed entries
    await knex('authors').insert([
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', birthdate: '1990-01-01' },
        { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', birthdate: '1992-02-02' }
    ]);

    await knex('posts').insert([
        { id: 1, author_id: 1, title: 'Post 1 by John Doe', content: 'Content of post 1', description: 'Description of post 1', date: '2025-01-01' },
        { id: 2, author_id: 1, title: 'Post 2 by John Doe', content: 'Content of post 2', description: 'Description of post 2', date: '2025-01-02' },
        { id: 3, author_id: 2, title: 'Post 1 by Jane Doe', content: 'Content of post 1', description: 'Description of post 1', date: '2025-02-01' }
    ]);
};
