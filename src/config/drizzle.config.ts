import { defineConfig } from 'drizzle-kit';
import env from '.';

export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    schema: './src/db/schemas',
    dbCredentials: {
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,

        ssl: false,
    },
});
