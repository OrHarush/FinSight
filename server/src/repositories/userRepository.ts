import { ClientSession, Types } from 'mongoose';

import User, { IUser } from '../models/User';
import { isExcludedEmail } from '../utils/excludedEmails';

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

export const deleteUserById = (id: string, session?: ClientSession) =>
  User.findByIdAndDelete(id).session(session ?? null);

export const countAll = async (): Promise<number> => User.countDocuments();

export const findAllActiveUserIds = async (): Promise<string[]> => {
  const users = await User.find({}, { _id: 1, email: 1 }).lean<
    { _id: Types.ObjectId; email: string }[]
  >();

  return users.filter(u => !isExcludedEmail(u.email)).map(u => u._id.toString());
};

export const countCreatedSince = async (since: Date): Promise<number> =>
  User.countDocuments({ createdAt: { $gte: since } });

export const countActiveSince = async (since: Date): Promise<number> =>
  User.countDocuments({ lastActiveAt: { $gte: since } });

export const countActivated = async (): Promise<number> =>
  User.countDocuments({ activatedAt: { $exists: true, $ne: null } });

export interface AdminUserRow {
  _id: Types.ObjectId;
  name: string;
  email: string;
  picture?: string;
  createdAt: Date;
  lastActiveAt?: Date;
  hasCompletedOnboarding: boolean;
}

export const findAllForAdmin = async (): Promise<AdminUserRow[]> =>
  User.find()
    .sort({ createdAt: -1 })
    .select('name email picture createdAt lastActiveAt hasCompletedOnboarding')
    .lean<AdminUserRow[]>();

export const updatePreferences = async (userId: string, displayCurrency: string) =>
  User.findByIdAndUpdate(userId, { displayCurrency }, { new: true });

export const updateAnalyticsConsent = async (
  userId: string,
  analyticsConsent: 'accepted' | 'rejected'
) =>
  User.findByIdAndUpdate(
    userId,
    { analyticsConsent, analyticsConsentUpdatedAt: new Date() },
    { new: true }
  );

export const updateOnboarding = async (userId: string) =>
  User.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          hasCompletedOnboarding: true,
          activatedAt: { $ifNull: ['$activatedAt', new Date()] },
        },
      },
    ],
    { new: true }
  );

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
