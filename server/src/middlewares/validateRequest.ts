import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);

        if (!result.success) {
          next(result.error);
          return;
        }

        req.body = result.data;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);

        if (!result.success) {
          next(result.error);
          return;
        }

        res.locals.params = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);

        if (!result.success) {
          next(result.error);
          return;
        }

        res.locals.query = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
