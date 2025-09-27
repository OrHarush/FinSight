export const ENTITY_NAMES = ['accounts', 'categories', 'transactions'] as const;

export type EntityName = (typeof ENTITY_NAMES)[number];
