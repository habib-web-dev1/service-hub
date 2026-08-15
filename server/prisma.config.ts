import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is only needed for Migrate/Studio (local dev).
// prisma generate does not require a connection URL.
// At runtime, the connection is handled via the PrismaPg adapter in src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  ...(process.env["DATABASE_URL"]
    ? {
        datasource: {
          url: process.env["DATABASE_URL"],
        },
      }
    : {}),
});
