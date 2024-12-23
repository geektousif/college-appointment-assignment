import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),

    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),

    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
});

const envConfig = envSchema.parse(process.env);

export default envConfig;
