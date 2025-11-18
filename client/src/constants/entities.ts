export const ENTITY_NAMES = ['accounts', 'categories', 'transactions', 'paymentMethods'] as const;

export type EntityName = (typeof ENTITY_NAMES)[number];
