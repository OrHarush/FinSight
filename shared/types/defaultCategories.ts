export const DEFAULT_CATEGORY_KEYS = [
    'salary',
    'freelance',
    'investments',
    'housing',
    'groceries',
    'transportation',
    'utilities',
    'dining_out',
    'other',
] as const;

export type DefaultCategoryKey = typeof DEFAULT_CATEGORY_KEYS[number];
