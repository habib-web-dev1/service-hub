import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  // Reserved for future refresh-token implementation
  JWT_REFRESH_SECRET: z.string().optional(),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid or missing environment variables:\n",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration. Check server logs.");
}

export const env = parsed.data;
