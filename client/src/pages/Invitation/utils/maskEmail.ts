export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');

  if (!local || !domain) {
    return email;
  }

  if (local.length <= 1) {
    return `${local}***@${domain}`;
  }

  return `${local[0]}***@${domain}`;
};
