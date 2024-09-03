import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv({
  path: './.env',
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'build-client', 'build-server']),
  SERVER_PORT: z.coerce.number().nonnegative(),
});

export const serverEnv = envSchema.parse(process.env);

export type ServerEnv = z.infer<typeof envSchema>;
