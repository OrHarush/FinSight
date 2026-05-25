export const formatRetentionRate = (rate: number | null): string => {
  if (rate == null) {
    return '—';
  }

  return `${Math.round(rate * 100)}%`;
};
