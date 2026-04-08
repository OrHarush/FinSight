import { z } from 'zod';

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
