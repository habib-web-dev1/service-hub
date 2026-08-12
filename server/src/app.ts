import cors from "cors";
import express from "express";
import morgan from "morgan";

import router from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ServiceHub API is running",
    data: null,
  });
});

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
