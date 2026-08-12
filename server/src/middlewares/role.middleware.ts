import type { NextFunction, Response } from "express";

import { ApiError } from "../lib/apiError.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new ApiError(403, "You do not have permission to access this resource"),
      );
    }

    next();
  };
};
