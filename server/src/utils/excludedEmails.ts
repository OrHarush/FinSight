const excludedEmails = new Set(
  (process.env.EXCLUDE_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean),
);

export const isExcludedEmail = (email: string): boolean =>
  excludedEmails.has(email.toLowerCase());
