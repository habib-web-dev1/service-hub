import app from "./app.js";

// Export the Express app as the default export.
// Vercel serverless functions use this directly — no listen() needed.
// Prisma will lazy-connect on the first query.
export default app;
