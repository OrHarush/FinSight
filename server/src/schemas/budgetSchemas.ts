import { z } from 'zod';

export const GetBudgetsSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/, 'year must be a 4-digit number'),
    month: z.string().regex(/^(1[0-2]|[1-9])$/, 'month must be between 1 and 12'),
  })
  .transform((data) => ({
    year: parseInt(data.year, 10),
    month: parseInt(data.month, 10) - 1,
  }));

export type GetBudgetsQuery = z.infer<typeof GetBudgetsSchema>;

export const CreateBudgetSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(0).max(11),
  limit: z.number().min(0, 'Limit cannot be negative'),
});

export type CreateBudgetBody = z.infer<typeof CreateBudgetSchema>;

export const CreateBudgetBulkSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  year: z.number().int().min(2000).max(2100),
  startMonth: z.number().int().min(0).max(11),
  endMonth: z.number().int().min(0).max(11),
  limit: z.number().min(0, 'Limit cannot be negative'),
});

export type CreateBudgetBulkBody = z.infer<typeof CreateBudgetBulkSchema>;

export const UpdateBudgetSchema = z.object({
  limit: z.number().min(0, 'Limit cannot be negative'),
});

export type UpdateBudgetBody = z.infer<typeof UpdateBudgetSchema>;
