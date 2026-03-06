export const ENTITY_NAMES = [
  'accounts',
  'categories',
  'transactions',
  'paymentMethods',
  'budgets',
] as const;

export type EntityName = (typeof ENTITY_NAMES)[number];
