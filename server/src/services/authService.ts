import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { ApiError } from '../errors/ApiError';
import { IUser } from '../models/User';
import {
  acceptTerms,
  createUser,
  findByEmail,
  findByProvider,
  saveUser,
  updateLastLogin,
} from '../repositories/userRepository';
import { recordLoginEvent } from './adminService';
import { syncAllAccountsForUser } from './balanceService';
import { generatePendingTransactions } from './recurringTemplateService';
import { createDefaultEntitiesForNewUser } from './userService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;

interface AuthPayload {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
}

export const loginOrRegister = async (payload: AuthPayload): Promise<IUser> => {
  const { provider, providerId, email, name, picture } = payload;

  let user = await findByProvider(provider, providerId);
  let isNewUser = false;

  if (!user) {
    user = await findByEmail(email);

    if (user) {
      user.providers.push({ provider, providerId });
    } else {
      isNewUser = true;

      user = await createUser({
        email,
        name,
        picture,
        providers: [{ provider, providerId }],
      });
    }

    await saveUser(user);
  }

  if (isNewUser) {
    await createDefaultEntitiesForNewUser(user._id.toString());
  }

  await recordLoginEvent({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  return user;
};

export const updateLastUserLogin = async (userId: string) => {
  try {
    await updateLastLogin(userId);
  } catch (err) {
    console.error('Failed to update lastLoginAt:', err);
  }
};

const CURRENT_TERMS_VERSION = process.env.CURRENT_TERMS_VERSION || 'v1.0';

interface AcceptTermsParams {
  userId: string;
  locale: string;
  ip: string;
  userAgent: string;
}

export const acceptTermsService = async ({ userId, locale, ip, userAgent }: AcceptTermsParams) =>
  acceptTerms({
    userId,
    locale,
    ip,
    userAgent,
    version: CURRENT_TERMS_VERSION,
  });

export const devLoginService = async () => {
  const email = process.env.DEV_AUTH_BYPASS_EMAIL;

  if (!email) {
    throw ApiError.badRequest('DEV_AUTH_BYPASS_EMAIL is not set');
  }

  const user = await findByEmail(email);

  if (!user) {
    throw ApiError.notFound(`Dev bypass user not found: ${email}`);
  }

  generatePendingTransactions(user._id.toString()).catch(err =>
    console.error('Failed to generate pending transactions on login:', err)
  );

  syncAllAccountsForUser(user._id.toString()).catch(err =>
    console.error('Failed to sync account balances on login:', err)
  );

  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    subject: user._id.toString(),
  });

  const showTerms = !user.acceptedTermsAt || user.consentVersion !== CURRENT_TERMS_VERSION;

  return { token, user, showTerms };
};

export const googleLoginService = async (googleToken: string) => {
  if (!googleToken) {
    throw ApiError.badRequest('Google token is required');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw ApiError.unauthorized('Invalid Google token');
  }

  const { email, name, picture, sub } = payload;

  const user = await loginOrRegister({
    provider: 'google',
    providerId: sub!,
    email: email!,
    name: name || '',
    picture,
  });

  await updateLastUserLogin(user._id);

  generatePendingTransactions(user._id.toString()).catch(err =>
    console.error('Failed to generate pending transactions on login:', err)
  );

  syncAllAccountsForUser(user._id.toString()).catch(err =>
    console.error('Failed to sync account balances on login:', err)
  );

  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    subject: user._id.toString(),
  });

  const showTerms = !user.acceptedTermsAt || user.consentVersion !== CURRENT_TERMS_VERSION;

  return { token, user, showTerms };
};
