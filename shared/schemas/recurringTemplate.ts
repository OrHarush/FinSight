import { z } from 'zod';

import { amountSchema, nameSchema, objectIdSchema } from './common';

const BaseRecurringTemplateSchema = z.object({
  // Recurrence rules
  frequency: z.enum(['Monthly', 'Yearly']),
  dayOfMonth: z.number().int().min(1).max(31),
  startDate: z.string(),
  endDate: z.string().optional(),

  // TX blueprint
  name: nameSchema(50).optional(),
  description: z.string().max(120, 'validation.nameTooLong').trim().optional(),
  type: z.enum(['Income', 'Expense', 'Transfer']),
  amount: amountSchema,
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

export const SplitRecurringTemplateSchema = BaseRecurringTemplateSchema.partial()
  .extend({ fromDate: z.string().min(1) })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({ path: ['endDate'], code: 'custom', message: 'validation.endDateAfterStart' });
    }
  });

export type SplitRecurringTemplateDTO = z.infer<typeof SplitRecurringTemplateSchema>;
