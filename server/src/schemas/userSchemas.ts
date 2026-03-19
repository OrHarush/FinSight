import { z } from 'zod';

const VALID_CURRENCIES = ['ILS', 'USD', 'EUR', 'GBP', 'JPY'] as const;

export const UpdatePreferencesSchema = z.object({
  displayCurrency: z.enum(VALID_CURRENCIES),
});

export type UpdatePreferencesBody = z.infer<typeof UpdatePreferencesSchema>;
