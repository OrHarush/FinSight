import { z } from 'zod';

import { nameSchema, objectIdSchema, positiveAmountSchema } from './common';

const BaseRecurringTemplateSchema = z.object({
  // Recurrence rules
  frequency: z.enum(['Monthly', 'Yearly']),
  dayOfMonth: z.number().int().min(1).max(31),
  startDate: z.string(),
  endDate: z.string().optional(),

  // TX blueprint
  name: nameSchema(50).optional(),
  note: z.string().max(200, 'validation.noteTooLong').trim().optional(),
  type: z.enum(['Income', 'Expense', 'Transfer']),
  amount: positiveAmountSchema,
  belongToPreviousMonth: z.boolean().optional(),

  // Conditional refs — all optional at schema level; service validates based on type
  categoryId: objectIdSchema.optional(),
  accountId: objectIdSchema.optional(),
  paymentMethodId: objectIdSchema.optional(),
  fromAccountId: objectIdSchema.optional(),
  toAccountId: objectIdSchema.optional(),
});

export const CreateRecurringTemplateSchema = BaseRecurringTemplateSchema.superRefine(
  (data, ctx) => {
    if (data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({ path: ['endDate'], code: 'custom', message: 'validation.endDateAfterStart' });
    }
  }
);

export type CreateRecurringTemplateDTO = z.infer<typeof CreateRecurringTemplateSchema>;

export const UpdateRecurringTemplateSchema = BaseRecurringTemplateSchema.partial().superRefine(
  (data, ctx) => {
    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({ path: ['endDate'], code: 'custom', message: 'validation.endDateAfterStart' });
    }
  }
);

export type UpdateRecurringTemplateDTO = z.infer<typeof UpdateRecurringTemplateSchema>;

export const DeactivateFromSchema = z.object({
  fromDate: z.string().min(1),
});

export type DeactivateFromDTO = z.infer<typeof DeactivateFromSchema>;

export const SplitRecurringTemplateSchema = BaseRecurringTemplateSchema.partial()
  .extend({ fromDate: z.string().min(1) })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({ path: ['endDate'], code: 'custom', message: 'validation.endDateAfterStart' });
    }
  });

export type SplitRecurringTemplateDTO = z.infer<typeof SplitRecurringTemplateSchema>;
