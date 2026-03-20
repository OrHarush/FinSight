import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'validation.invalidId');

export const nameSchema = (max: number) =>
  z.string().min(1, 'validation.required').max(max, 'validation.nameTooLong').trim();

export const amountSchema = z
  .number({ invalid_type_error: 'validation.invalidNumber' })
  .refine((v) => v !== 0, { message: 'validation.amountZero' })
  .refine((v) => v >= -999_999_999 && v <= 999_999_999, {
    message: 'validation.amountOutOfRange',
  });

export const positiveAmountSchema = z
  .number({ invalid_type_error: 'validation.invalidNumber' })
  .positive('validation.mustBePositive')
  .max(999_999_999, 'validation.amountOutOfRange');
