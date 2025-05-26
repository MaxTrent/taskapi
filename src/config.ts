import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// dotenv.config({ path: path.join(__dirname, '../.env') });

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
//   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
SENDGRID_API_KEY: z.string().optional(),
FRONTEND_URL: z.string().url().optional(),
SENDER_EMAIL: z.string().email().optional(),
  PORT: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()),
  DATABASE_URL: z.string(),
  DOCKER_DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
     TWILIO_ACCOUNT_SID: z.string().optional(),
     TWILIO_AUTH_TOKEN: z.string().optional(),
     TWILIO_PHONE_NUMBER: z.string().optional(),
     GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
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
  SENDGRID_API_KEY: envVars.SENDGRID_API_KEY,
  DATABASE_URL: envVars.DATABASE_URL,
  JWT_SECRET: envVars.JWT_SECRET,
  FRONTEND_URL: envVars.FRONTEND_URL,
  SENDER_EMAIL: envVars.SENDER_EMAIL,
  TWILIO_PHONE_NUMBER: envVars.TWILIO_PHONE_NUMBER,
  TWILIO_ACCOUNT_SID  : envVars.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
  DOCKER_DATABASE_URL: envVars.DOCKER_DATABASE_URL,
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: envVars.GOOGLE_REDIRECT_URI,
};