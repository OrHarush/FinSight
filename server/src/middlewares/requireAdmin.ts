import { Request, Response, NextFunction } from 'express';
import { findById } from '../repositories/userRepository';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).end();
  }

  const user = await findById(userId);

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).end();
  }

  next();
};
