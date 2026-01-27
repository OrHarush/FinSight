import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { extractUserIdFromBearerToken, isValidBearerToken } from '../utils/auth';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!isValidBearerToken(authHeader)) {
    return next(ApiError.unauthorized('Unauthorized'));
  }

  req.userId = extractUserIdFromBearerToken(authHeader);

  return next();
};
