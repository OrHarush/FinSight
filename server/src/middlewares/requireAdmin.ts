import { Request, Response, NextFunction } from 'express';
import { findById } from '../repositories/userRepository';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).end();
  }

  const user = await findById(userId);

  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!user || !ADMIN_EMAILS?.includes(user.email.toLowerCase())) {
    return res.status(403).end();
  }

  next();
};
