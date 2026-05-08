import { z } from 'zod';

import { nameSchema, positiveAmountSchema } from './common';

const startOfTodayUtc = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'validation.invalidColor');

export const GoalImportance = z.enum(['low', 'medium', 'high']);
export const GoalStatus = z.enum(['active', 'achieved', 'archived']);

export type GoalImportanceValue = z.infer<typeof GoalImportance>;
export type GoalStatusValue = z.infer<typeof GoalStatus>;

export const CreateGoalSchema = z.object({
  name: nameSchema(60),
  icon: z.string().max(40).nullish(),
  color: hexColor.nullish(),
  targetAmount: positiveAmountSchema,
  initialAmount: z
    .number()
    .min(0, 'validation.mustBeNonNegative')
    .max(999_999_999, 'validation.amountOutOfRange')
    .optional()
    .default(0),
  targetDate: z.coerce
    .date({
      required_error: 'validation.required',
      invalid_type_error: 'validation.invalidDate',
    })
    .refine((d) => d >= startOfTodayUtc(), { message: 'validation.targetDateInPast' }),
  expectedAnnualReturn: z.number().min(0).max(20).optional().default(0),
  importance: GoalImportance.optional().default('medium'),
  description: z.string().max(500).nullish(),
});

export type CreateGoalDTO = z.infer<typeof CreateGoalSchema>;

export const UpdateGoalSchema = z
  .object({
    name: nameSchema(60).optional(),
    icon: z.string().max(40).nullish(),
    color: hexColor.nullish(),
    targetAmount: positiveAmountSchema.optional(),
    initialAmount: z.number().min(0).max(999_999_999).optional(),
    targetDate: z.coerce.date().optional(),
    expectedAnnualReturn: z.number().min(0).max(20).optional(),
    importance: GoalImportance.optional(),
    description: z.string().max(500).nullish(),
    status: GoalStatus.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'validation.required' });

export type UpdateGoalDTO = z.infer<typeof UpdateGoalSchema>;

export const GetGoalsQuerySchema = z.object({
  status: GoalStatus.optional(),
});

export type GetGoalsQuery = z.infer<typeof GetGoalsQuerySchema>;

export const DeleteGoalQuerySchema = z.object({
  keepCategory: z
    .enum(['true', 'false'])
    .optional()
    .default('true')
    .transform((v) => v === 'true'),
});

export type DeleteGoalQuery = z.infer<typeof DeleteGoalQuerySchema>;

export const GetGhostsQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'validation.invalidMonth'),
});

export type GetGhostsQuery = z.infer<typeof GetGhostsQuerySchema>;
