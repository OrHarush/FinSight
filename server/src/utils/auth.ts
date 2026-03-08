import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../../shared/types/Role';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;

export interface UserTokenPayload {
  userId: string;
  role: UserRole;
}

export function isValidBearerToken(authHeader?: string): boolean {
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return true;
  } catch {
    return false;
  }
}

export function extractUserIdFromBearerToken(authHeader?: string): string {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing Bearer token');
  }

  const token = authHeader.slice('Bearer '.length).trim();

  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded || typeof decoded.userId !== 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded.userId;
}

export function extractUserDataFromBearerToken(authHeader?: string): UserTokenPayload {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing Bearer token');
  }

  const token = authHeader.slice('Bearer '.length).trim();

  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded || typeof decoded.userId !== 'string') {
    throw new Error('Invalid token payload');
  }

  return {
    userId: decoded.userId,
    role: decoded.role as UserRole,
  };
}
