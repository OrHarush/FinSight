import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const responseMessage = isApiError ? err.message : 'Internal server error';
  const requestId = req.id ?? 'unknown';

  const logEntry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level: 'error',
    requestId,
    userId: req.userId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err instanceof Error ? err.message : String(err),
    isOperational: isApiError,
  };

  if (!isApiError || statusCode >= 500) {
    logEntry.stack = err instanceof Error ? err.stack : undefined;
  }

  console.error(JSON.stringify(logEntry));

  return res.status(statusCode).json({ success: false, error: responseMessage, requestId });
};
