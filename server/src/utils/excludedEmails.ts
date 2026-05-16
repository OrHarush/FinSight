const BASELINE_EXCLUDED_EMAILS = ['lyra.il.app@gmail.com'];

const excludedEmails = new Set(
  [
    ...BASELINE_EXCLUDED_EMAILS,
    ...(process.env.EXCLUDE_EMAILS ?? '').split(','),
  ]
    .map(e => e.trim().toLowerCase())
    .filter(Boolean),
);

export const isExcludedEmail = (email: string): boolean =>
  excludedEmails.has(email.toLowerCase());
