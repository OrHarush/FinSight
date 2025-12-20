import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { getUserIdFromAuthHeader } from '../utils/auth';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const userId = getUserIdFromAuthHeader(req.headers.authorization);

  if (!userId) {
    throw ApiError.unauthorized('No token provided or token invalid');
  }

  req.userId = userId;
  next();
};
