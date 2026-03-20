import { z } from 'zod';

import { objectIdSchema, positiveAmountSchema } from './common';

export const GetBudgetsSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/, 'validation.required'),
    month: z.string().regex(/^(1[0-2]|[1-9])$/, 'validation.required'),
  })
  .transform((data) => ({
    year: parseInt(data.year, 10),
    month: parseInt(data.month, 10) - 1,
  }));

export type GetBudgetsQuery = z.infer<typeof GetBudgetsSchema>;

export const CreateBudgetSchema = z.object({
  categoryId: objectIdSchema,
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1, 'validation.required').max(12, 'validation.required'),
  limit: positiveAmountSchema,
});

export type CreateBudgetDTO = z.infer<typeof CreateBudgetSchema>;

export const CreateBudgetBulkSchema = z
  .object({
    categoryId: objectIdSchema,
    year: z.number().int().min(2000).max(2100),
    startMonth: z.number().int().min(1, 'validation.required').max(12, 'validation.required'),
    endMonth: z.number().int().min(1, 'validation.required').max(12, 'validation.required'),
    limit: positiveAmountSchema,
  })
  .superRefine((data, ctx) => {
    if (data.startMonth > data.endMonth) {
      ctx.addIssue({
        path: ['startMonth'],
        code: 'custom',
        message: 'validation.startMonthBeforeEnd',
      });
    }
  });

export type CreateBudgetBulkDTO = z.infer<typeof CreateBudgetBulkSchema>;

export const UpdateBudgetSchema = z.object({
  limit: positiveAmountSchema,
});

export type UpdateBudgetDTO = z.infer<typeof UpdateBudgetSchema>;

// Form schema: what the budget form collects (category select + limit)
export const BudgetFormSchema = z.object({
  category: objectIdSchema,
  limit: positiveAmountSchema,
  applyToRestOfYear: z.boolean().optional(),
});

export type BudgetFormValues = z.infer<typeof BudgetFormSchema>;
