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

export interface DeletionFeedbackPayload {
  reason: DeletionReason | null;
  comment: string | null;
  locale: 'he' | 'en';
}

export type DeletionStep = 'feedback' | 'confirm' | 'deleting';
