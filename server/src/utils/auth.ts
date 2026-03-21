import { UserRole } from '@finsight/shared';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;

export interface UserTokenPayload {
  userId: string;
  role: UserRole;
}

export function verifyAndExtractBearerToken(authHeader?: string): UserTokenPayload | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as JwtPayload;

    if (!decoded || typeof decoded.userId !== 'string') {
      return null;
    }

    return {
      userId: decoded.userId,
      role: decoded.role as UserRole,
    };
  } catch {
    return null;
  }
}

export function extractUserDataFromBearerToken(authHeader?: string): UserTokenPayload {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing Bearer token');
  }

  const userData = verifyAndExtractBearerToken(authHeader);

  if (!userData) {
    throw new Error('Invalid or expired token');
  }

  return userData;
}
