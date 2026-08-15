import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/apiError.js";
import { jwtUtils } from "../lib/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return next(new ApiError(401, "Authentication required"));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Invalid authorization format"));
  }

  try {
    const payload = jwtUtils.verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
