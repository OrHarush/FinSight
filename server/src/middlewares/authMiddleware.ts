import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { extractUserDataFromBearerToken, isValidBearerToken } from '../utils/auth';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!isValidBearerToken(authHeader)) {
    return next(ApiError.unauthorized('Unauthorized'));
  }

  const userData = extractUserDataFromBearerToken(authHeader);
  req.userId = userData.userId;
  req.userRole = userData.role;

  return next();
};
