import { z } from 'zod';

import { nameSchema } from './common';

export const CreateCategorySchema = z.object({
  name: nameSchema(30),
  type: z.enum(['Income', 'Expense']),
  icon: z.string().optional(),
  color: z.string().optional(),
  key: z.string().optional(),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type CategoryType = CreateCategoryDTO['type'];

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
