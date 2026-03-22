import { z } from 'zod';

export const PAYMENT_METHOD_TYPES = [
  'Credit Card',
  'Debit',
  'Bank Transfer',
  'PayPal',
  'Bit',
  'PayBox',
  'Cash',
] as const;

export type PaymentMethodType = (typeof PAYMENT_METHOD_TYPES)[number];

export const TYPES_REQUIRING_NAME: PaymentMethodType[] = ['Credit Card', 'Debit', 'Bank Transfer'];

const CARD_TYPES: PaymentMethodType[] = ['Credit Card', 'Debit'];

const optionalNameField = (max: number) =>
  z.preprocess(
    (v) => (v == null ? undefined : v),
    z.string().max(max, 'validation.nameTooLong').trim().optional()
  );

const optionalNumberField = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v == null ? undefined : v), schema.optional());

export const CreatePaymentMethodSchema = z
  .object({
    name: optionalNameField(30),
    type: z.enum(PAYMENT_METHOD_TYPES, { required_error: 'validation.required' }),
    lastFourDigits: z.preprocess(
      (v) => (v == null ? undefined : v),
      z
        .string()
        .regex(/^\d{4}$/, 'validation.exactlyFourDigits')
        .optional()
    ),
    billingDay: optionalNumberField(
      z.number().int().min(1, 'validation.billingDayRange').max(31, 'validation.billingDayRange')
    ),
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (TYPES_REQUIRING_NAME.includes(data.type) && !data.name?.trim()) {
      ctx.addIssue({
        path: ['name'],
        code: 'custom',
        message: 'validation.required',
      });
    }

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
    name: optionalNameField(30),
    type: z.enum(PAYMENT_METHOD_TYPES).optional(),
    lastFourDigits: z.preprocess(
      (v) => (v == null ? undefined : v),
      z
        .string()
        .regex(/^\d{4}$/, 'validation.exactlyFourDigits')
        .optional()
    ),
    billingDay: optionalNumberField(
      z.number().int().min(1, 'validation.billingDayRange').max(31, 'validation.billingDayRange')
    ),
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== undefined && TYPES_REQUIRING_NAME.includes(data.type) && !data.name?.trim()) {
      ctx.addIssue({
        path: ['name'],
        code: 'custom',
        message: 'validation.required',
      });
    }

    if (
      data.lastFourDigits !== undefined &&
      data.type !== undefined &&
      !CARD_TYPES.includes(data.type)
    ) {
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
