import {
  findByProvider,
  findByEmail,
  createUser,
  saveUser,
  updateLastLogin,
  acceptTerms,
} from '../repositories/userRepository';
import { IUser } from '../models/User';
import { createDefaultEntitiesForNewUser } from './userService';

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
    await createDefaultEntitiesForNewUser(user._id as string);
  }

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
