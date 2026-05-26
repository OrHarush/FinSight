export const DEFAULT_CATEGORY_KEYS = [
    'salary',
    'freelance',
    'investments',
    'housing',
    'utilities',
    'groceries',
    'transportation',
    'dining_out',
    'entertainment',
    'health',
    'subscriptions',
    'insurance',
    'loan',
    'other',
] as const;

export type DefaultCategoryKey = typeof DEFAULT_CATEGORY_KEYS[number];
