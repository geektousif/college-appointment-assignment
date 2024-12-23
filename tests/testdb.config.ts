// import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
// import { Pool } from 'pg';
import schemas from '../src/db/schemas';
import { getTableName, is, sql } from 'drizzle-orm';
import db from '../src/db';
import { PgTable } from 'drizzle-orm/pg-core';

// const pool = new Pool({
//     host: 'localhost',
//     port: 5433,
//     user: 'postgres',
//     password: 'postgres',
//     database: 'test_db',
//     ssl: false,
//     connectionTimeoutMillis: 0,
//     idleTimeoutMillis: 0,
// });

// pool.on('error', (err) => {
//     console.error(err);
// });

// const db = drizzle({
//     client: pool,
//     casing: 'snake_case',
//     schema: schemas,
// });

const connect = async () => {
    try {
        await migrate(db, { migrationsFolder: './drizzle' });
    } catch (error) {
        console.error(error);
    }
};

const cleanup = async () => {
    const tables = Object.values(schemas)
        .filter((table) => is(table, PgTable))
        .map((table) => getTableName(table));

    for (const table of tables) {
        await db.execute(sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE;`);
    }
};

const disconnect = async () => {
    await db.$client.end();
};

export default { db, connect, cleanup, disconnect };
