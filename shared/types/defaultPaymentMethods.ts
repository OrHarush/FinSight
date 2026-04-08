export const DEFAULT_PAYMENT_METHOD_KEYS = ['credit_card', 'immediate_debit'] as const;

export type DefaultPaymentMethodKey = (typeof DEFAULT_PAYMENT_METHOD_KEYS)[number];
