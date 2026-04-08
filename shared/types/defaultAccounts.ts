export const DEFAULT_ACCOUNT_KEYS = ['checking_account'] as const;

export type DefaultAccountKey = (typeof DEFAULT_ACCOUNT_KEYS)[number];
