import mongoose, { Schema, Document } from 'mongoose';

interface Provider {
  provider: string;
  providerId: string;
}

export interface IUser extends Document {
  email: string;
  name: string;
  picture?: string;
  providers: Provider[];
  acceptedTermsAt: Date | null;
  acceptedPrivacyAt: Date | null;
  consentVersion?: string;
  consentLocale?: string;
  consentIp?: string;
  consentUserAgent?: string;
  lastLoginAt?: Date;
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
    providers: { type: [ProviderSchema], default: [] },
    acceptedTermsAt: { type: Date, default: null },
    acceptedPrivacyAt: { type: Date, default: null },
    consentVersion: { type: String },
    consentLocale: { type: String },
    consentIp: { type: String },
    consentUserAgent: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index(
  { 'providers.provider': 1, 'providers.providerId': 1 },
  { unique: true, sparse: true }
);

export default mongoose.model<IUser>('User', UserSchema);
