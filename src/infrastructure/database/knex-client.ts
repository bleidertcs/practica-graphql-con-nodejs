import 'dotenv/config';
import knex, { Knex } from 'knex';

/**
 * Knex configuration for different environments
 */
const isTest = process.env.NODE_ENV === 'test';

const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: isTest ? 'localhost' : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

/**
 * Create a new Knex instance
 */
export const createKnexClient = (): Knex => {
  return knex(knexConfig);
};

/**
 * Default Knex configuration export for migrations
 */
export default knexConfig;
