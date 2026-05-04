import mongoose, { Schema } from 'mongoose';

export const DELETION_REASONS = [
  'too_complex',
  'missing_feature',
  'found_alternative',
  'not_useful',
  'privacy_concern',
  'just_testing',
  'other',
] as const;

export type DeletionReason = (typeof DELETION_REASONS)[number];

export interface IDeletionFeedback {
  _id: string;
  reason: DeletionReason | null;
  comment: string | null;
  transactionCount: number;
  daysSinceSignup: number;
  hadCompletedOnboarding: boolean;
  locale: 'he' | 'en';
  createdAt: Date;
}

const DeletionFeedbackSchema = new Schema<IDeletionFeedback>(
  {
    reason: { type: String, enum: [...DELETION_REASONS, null], default: null },
    comment: { type: String, maxlength: 500, trim: true, default: null },
    transactionCount: { type: Number, required: true, default: 0 },
    daysSinceSignup: { type: Number, required: true, default: 0 },
    hadCompletedOnboarding: { type: Boolean, required: true, default: false },
    locale: { type: String, enum: ['he', 'en'], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

DeletionFeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IDeletionFeedback>(
  'DeletionFeedback',
  DeletionFeedbackSchema,
  'deletion_feedback'
);
