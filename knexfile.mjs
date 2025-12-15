// Knexfile for migrations (JavaScript version for Docker compatibility)
import 'dotenv/config';

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
    loadExtensions: ['.mjs'],  // Only load .mjs files
  },
};

export default config;
