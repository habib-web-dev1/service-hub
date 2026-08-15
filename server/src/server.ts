import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
};

startServer();

export default app;
