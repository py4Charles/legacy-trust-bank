import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "postgresql://ltb:ltb@localhost:5433/ltb?schema=public"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(1, "omhe8GTJZYzWrBmuDBdNsGHn0IxvVP71ByK8CQmgjuW9VRC_MEDM1qes1Q23Rg8l"),
  JWT_REFRESH_SECRET: z.string().min(1, "Ui1ys3rW4GJLRXfeKY6WTgnLJpVrbXNVxs9jyDoYqY5pWX7edPeqkGLyIUSf0cvM"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("30d"),
  TWO_FACTOR_ENABLED: z
    .string()
    .default("true")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
