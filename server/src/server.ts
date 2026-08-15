import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully.");

    app.listen(env.PORT, () => {
      console.log(`ServiceHub API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
