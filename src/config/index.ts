import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),

    DB_URL: z.string(),
    DB_CERT_PATH: z.string(),

    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),

    PASSWORD_HASH_ROUNDS: z.coerce.number().default(10),
});

const envConfig = envSchema.parse(process.env);

export default envConfig;
