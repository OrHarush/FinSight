import { z } from 'zod';

import { DELETION_REASONS } from '../models/DeletionFeedback';

const VALID_CURRENCIES = ['ILS', 'USD', 'EUR', 'GBP', 'JPY'] as const;

export const UpdatePreferencesSchema = z.object({
  displayCurrency: z.enum(VALID_CURRENCIES),
});

export type UpdatePreferencesBody = z.infer<typeof UpdatePreferencesSchema>;

export const CompleteOnboardingSchema = z.object({
  hasCompletedOnboarding: z.literal(true),
  billingDay: z.number().int().min(1).max(28).optional(),
});

export type CompleteOnboardingBody = z.infer<typeof CompleteOnboardingSchema>;

export const UpdateAnalyticsConsentSchema = z.object({
  analyticsConsent: z.enum(['accepted', 'rejected']),
});

export type UpdateAnalyticsConsentBody = z.infer<typeof UpdateAnalyticsConsentSchema>;

export const DeleteUserSchema = z.object({
  feedback: z
    .object({
      reason: z.enum(DELETION_REASONS).nullable().optional(),
      comment: z.string().max(500).trim().nullable().optional(),
      locale: z.enum(['he', 'en']),
    })
    .optional(),
});

export type DeleteUserBody = z.infer<typeof DeleteUserSchema>;

export const UpdateMarketingEmailsSchema = z.object({
  marketingEmailsEnabled: z.boolean(),
});

export type UpdateMarketingEmailsBody = z.infer<typeof UpdateMarketingEmailsSchema>;
