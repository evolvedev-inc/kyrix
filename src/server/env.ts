import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv({
  path: './.env',
});

// Add all possible environment varibales which will be required in server only.
// These will be validated and crash the application with appropriate error to reduce
// bugs at runtime.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  SERVER_PORT: z.coerce.number().nonnegative(),
});

export const serverEnv = envSchema.parse(process.env);

export type ServerEnv = z.infer<typeof envSchema>;
