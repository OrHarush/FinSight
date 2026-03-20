import { NextFunction,Request, Response } from 'express';
import { ZodType } from 'zod';

import { ApiError } from '../errors/ApiError';

export const validateQuery =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw ApiError.badRequest(result.error.issues.map((i) => i.message).join(', '));
    }

    req.validatedQuery = result.data;
    next();
  };

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw ApiError.badRequest(result.error.issues.map((i) => i.message).join(', '));
    }

    req.validatedBody = result.data;
    next();
  };
