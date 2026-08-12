import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { ApiError } from "../lib/apiError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });

    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: null,
  });
};
