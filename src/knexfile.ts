import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test';
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('isTest:', isTest);

export default {
    client: 'mysql2',
    connection: {
        host: isTest ? 'localhost' : process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    migrations: {
      directory: '../migrations', // Changed to point to the root migrations folder
      extensions: ['.ts'],
    },
};