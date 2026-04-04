import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'validation.invalidId');

const ParsedRowSchema = z.object({
  date: z.string().min(1, 'Row date is required.'),
  name: z.string(),
  amount: z.number(),
});

export const ImportTransactionsSchema = z.object({
  rows: z.array(ParsedRowSchema).min(1, 'At least one row is required.'),
  accountId: objectIdSchema,
  paymentMethodId: objectIdSchema,
  dateFilter: z
    .object({
      from: z.string().min(1),
      to: z.string().min(1),
    })
    .optional(),
});

export type ImportTransactionsDTO = z.infer<typeof ImportTransactionsSchema>;
