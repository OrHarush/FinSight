import User, { IUser } from '../models/User';
import { Types } from 'mongoose';

export const findById = async (userId: string | Types.ObjectId) => User.findById(userId);

export const findByProvider = async (provider: string, providerId: string): Promise<IUser | null> =>
  User.findOne({ 'providers.provider': provider, 'providers.providerId': providerId });

export const findByEmail = async (email: string): Promise<IUser | null> => User.findOne({ email });

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return user.save();
};

//TODO Fix type any
export const saveUser = async (user: any): Promise<IUser> => user.save();

export const updateLastLogin = async (userId: string) =>
  User.findByIdAndUpdate(userId, { lastLoginAt: new Date() }, { new: true });

export const deleteUserById = (id: string) => User.findByIdAndDelete(id);

export const countAll = async (): Promise<number> => User.countDocuments();

interface AcceptTermsRepoInput {
  userId: string | Types.ObjectId;
  locale: string;
  ip: string;
  userAgent: string;
  version: string;
}

export const acceptTerms = async ({
  userId,
  locale,
  ip,
  userAgent,
  version,
}: AcceptTermsRepoInput) => {
  const now = new Date();

  return User.findByIdAndUpdate(
    userId,
    {
      acceptedTermsAt: now,
      acceptedPrivacyAt: now,
      consentVersion: version,
      consentLocale: locale,
      consentIp: ip,
      consentUserAgent: userAgent,
    },
    { new: true }
  );
};
