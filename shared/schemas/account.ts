import { z } from 'zod';

import { DEFAULT_ACCOUNT_KEYS } from '../types/defaultAccounts';
import { amountSchema, nameSchema } from './common';

export const CreateAccountSchema = z.object({
  name: nameSchema(40),
  balance: amountSchema,
  institution: z.string().max(50).trim().optional(),
  accountNumber: z
    .string()
    .regex(/^\d+$/, 'validation.accountNumberInvalid')
    .max(20, 'validation.accountNumberTooLong')
    .optional(),
  icon: z.string().optional(),
  currency: z.string().optional(),
  isPrimary: z.boolean().optional(),
  key: z.enum(DEFAULT_ACCOUNT_KEYS).optional(),
});

export type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;

export const UpdateAccountSchema = CreateAccountSchema.partial().superRefine((data, ctx) => {
  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'validation.required',
    });
  }
});

export type UpdateAccountDTO = z.infer<typeof UpdateAccountSchema>;
