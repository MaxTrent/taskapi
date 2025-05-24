import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../.env') });

const envSchema = z.object({
//   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;

let envVars: EnvConfig;

try {
  envVars = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    throw new Error(`Environment validation error: ${JSON.stringify(error.errors, null, 2)}`);
  }
  throw error;
}

export const config: EnvConfig = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  JWT_SECRET: envVars.JWT_SECRET,
};