import { NextFunction, Request, Response } from 'express';
import { ZodIssue, ZodType } from 'zod';

import { ApiError } from '../errors/ApiError';

const isLoggablePrimitive = (input: unknown) =>
  (typeof input === 'number' && Number.isFinite(input)) ||
  typeof input === 'boolean' ||
  (typeof input === 'string' && input.length <= 50);

const formatIssue = (issue: ZodIssue) => {
  const path = issue.path.join('.');
  const input = (issue as ZodIssue & { input?: unknown }).input;

  return isLoggablePrimitive(input)
    ? `${path}: ${issue.message} (got: ${JSON.stringify(input)})`
    : `${path}: ${issue.message}`;
};

const formatIssues = (issues: ZodIssue[]) => issues.map(formatIssue).join(', ');

export const validateQuery =
  <Output, Input = Output>(schema: ZodType<Output, any, Input>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw ApiError.badRequest(formatIssues(result.error.issues));
    }

    req.validatedQuery = result.data;
    next();
  };

export const validateBody =
  <Output, Input = Output>(schema: ZodType<Output, any, Input>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw ApiError.badRequest(formatIssues(result.error.issues));
    }

    req.validatedBody = result.data;
    next();
  };
