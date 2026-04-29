import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.id = randomUUID();
  next();
};
