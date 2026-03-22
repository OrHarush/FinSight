import { z } from 'zod';

export const PAYMENT_METHOD_TYPES = [
  'Credit Card',
  'Debit',
  'Bank Transfer',
  'Checks',
  'Standing Order',
  'PayPal',
  'Bit',
  'PayBox',
  'Cash',
] as const;

export type PaymentMethodType = (typeof PAYMENT_METHOD_TYPES)[number];

export const TYPES_REQUIRING_NAME: PaymentMethodType[] = ['Credit Card', 'Debit', 'Bank Transfer', 'Checks', 'Standing Order'];

const CARD_TYPES: PaymentMethodType[] = ['Credit Card', 'Debit'];

const lastFourDigitsField = z
  .string()
  .transform((v) => (v === '' ? undefined : v))
  .optional()
  .refine((v) => v === undefined || /^\d{4}$/.test(v), 'validation.exactlyFourDigits');

const billingDayField = z
  .number({ invalid_type_error: 'validation.invalidNumber' })
  .int()
  .min(1, 'validation.billingDayRange')
  .max(31, 'validation.billingDayRange')
  .optional();

const nameField = z.string().max(30, 'validation.nameTooLong').trim().optional();

const addCrossFieldRules = (
  data: { type?: string; name?: string; lastFourDigits?: string; billingDay?: number },
  ctx: z.RefinementCtx
) => {
  if (
    data.type !== undefined &&
    TYPES_REQUIRING_NAME.includes(data.type as PaymentMethodType) &&
    !data.name?.trim()
  ) {
    ctx.addIssue({ path: ['name'], code: 'custom', message: 'validation.required' });
  }

  if (data.type === 'Credit Card' && data.billingDay == null) {
    ctx.addIssue({ path: ['billingDay'], code: 'custom', message: 'validation.required' });
  }

  if (
    data.lastFourDigits !== undefined &&
    data.type !== undefined &&
    !CARD_TYPES.includes(data.type as PaymentMethodType)
  ) {
    ctx.addIssue({ path: ['lastFourDigits'], code: 'custom', message: 'validation.notApplicable' });
  }

  if (data.billingDay !== undefined && data.type !== undefined && data.type !== 'Credit Card') {
    ctx.addIssue({ path: ['billingDay'], code: 'custom', message: 'validation.notApplicable' });
  }
};

export const CreatePaymentMethodSchema = z
  .object({
    name: nameField,
    type: z.enum(PAYMENT_METHOD_TYPES, { required_error: 'validation.required' }),
    lastFourDigits: lastFourDigitsField,
    billingDay: billingDayField,
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => addCrossFieldRules(data, ctx));

export type CreatePaymentMethodDTO = z.infer<typeof CreatePaymentMethodSchema>;

export const UpdatePaymentMethodSchema = z
  .object({
    name: nameField,
    type: z.enum(PAYMENT_METHOD_TYPES).optional(),
    lastFourDigits: lastFourDigitsField,
    billingDay: billingDayField,
    isPrimary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => addCrossFieldRules(data, ctx));

export type UpdatePaymentMethodDTO = z.infer<typeof UpdatePaymentMethodSchema>;
