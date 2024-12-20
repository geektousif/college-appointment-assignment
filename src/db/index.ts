import { drizzle } from 'drizzle-orm/node-postgres';
import env from '../config';
import { Pool } from 'pg';

const pool = new Pool({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
});

const db = drizzle({
    client: pool,
    casing: 'snake_case', // This is for drizzle to use snake_case in the database, while using camelCase in the code
});

export default db;
