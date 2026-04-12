import { USER_ROLES, UserRole } from '@lyra/shared';
import mongoose, { Schema } from 'mongoose';

interface Provider {
  provider: string;
  providerId: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  providers: Provider[];
  acceptedTermsAt: Date | null;
  acceptedPrivacyAt: Date | null;
  consentVersion?: string;
  consentLocale?: string;
  consentIp?: string;
  consentUserAgent?: string;
  lastLoginAt?: Date;
  displayCurrency: string;
  hasCompletedOnboarding: boolean;
  lastActiveAt?: Date;
  activatedAt?: Date;
  totalTransactions: number;
}

const ProviderSchema = new Schema<Provider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    picture: String,
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      required: true,
    },
    providers: { type: [ProviderSchema], default: [] },
    acceptedTermsAt: { type: Date, default: null },
    acceptedPrivacyAt: { type: Date, default: null },
    consentVersion: { type: String },
    consentLocale: { type: String },
    consentIp: { type: String },
    consentUserAgent: { type: String },
    lastLoginAt: { type: Date },
    displayCurrency: { type: String, default: 'ILS' },
    hasCompletedOnboarding: { type: Boolean, default: false },
    lastActiveAt: { type: Date },
    activatedAt: { type: Date },
    totalTransactions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.index(
  { 'providers.provider': 1, 'providers.providerId': 1 },
  { unique: true, sparse: true }
);

UserSchema.index({ lastActiveAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);
