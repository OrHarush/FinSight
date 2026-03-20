import { z } from 'zod';

import { nameSchema } from './common';

export const PAYMENT_METHOD_TYPES = [
  'Credit Card',
  'Debit',
  'PayPal',
  'Bit',
  'PayBox',
  'Cash',
] as const;

export type PaymentMethodType = (typeof PAYMENT_METHOD_TYPES)[number];

const CARD_TYPES: PaymentMethodType[] = ['Credit Card', 'Debit'];

export const CreatePaymentMethodSchema = z
  .object({
    name: nameSchema(30),
    type: z.enum(PAYMENT_METHOD_TYPES),
    lastFourDigits: z
      .string()
      .regex(/^\d{4}$/, 'validation.exactlyFourDigits')
      .optional(),
    billingDay: z
      .number()
      .int()
      .min(1, 'validation.billingDayRange')
      .max(31, 'validation.billingDayRange')
      .optional(),
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.lastFourDigits !== undefined && !CARD_TYPES.includes(data.type)) {
      ctx.addIssue({
        path: ['lastFourDigits'],
        code: 'custom',
        message: 'validation.invalidId',
      });
    }

    if (data.billingDay !== undefined && data.type !== 'Credit Card') {
      ctx.addIssue({
        path: ['billingDay'],
        code: 'custom',
        message: 'validation.invalidId',
      });
    }
  });

export type CreatePaymentMethodDTO = z.infer<typeof CreatePaymentMethodSchema>;

export const UpdatePaymentMethodSchema = z
  .object({
    name: nameSchema(30).optional(),
    type: z.enum(PAYMENT_METHOD_TYPES).optional(),
    lastFourDigits: z
      .string()
      .regex(/^\d{4}$/, 'validation.exactlyFourDigits')
      .optional(),
    billingDay: z
      .number()
      .int()
      .min(1, 'validation.billingDayRange')
      .max(31, 'validation.billingDayRange')
      .optional(),
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.lastFourDigits !== undefined && data.type !== undefined && !CARD_TYPES.includes(data.type)) {
      ctx.addIssue({
        path: ['lastFourDigits'],
        code: 'custom',
        message: 'validation.invalidId',
      });
    }

    if (data.billingDay !== undefined && data.type !== undefined && data.type !== 'Credit Card') {
      ctx.addIssue({
        path: ['billingDay'],
        code: 'custom',
        message: 'validation.invalidId',
      });
    }
  });

export type UpdatePaymentMethodDTO = z.infer<typeof UpdatePaymentMethodSchema>;
