import { drizzle } from 'drizzle-orm/node-postgres';
import env from '../config';
import { Pool } from 'pg';

const isTestEnv = env.NODE_ENV === 'test';

let dbConfig;
if (isTestEnv) {
    dbConfig = {
        host: 'localhost',
        port: 5433,
        user: 'postgres',
        password: 'postgres',
        database: 'test_db',
    };
} else {
    dbConfig = {
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
    };
}

const pool = new Pool(dbConfig);

const db = drizzle({
    client: pool,
    casing: 'snake_case', // This is for drizzle to use snake_case in the database, while using camelCase in the code
});

export default db;
