import { Dayjs } from 'dayjs';

export const buildTransactionsDrilldownUrl = (categoryId: string, month: Dayjs): string => {
  const monthParam = month.format('YYYY-MM');

  return `/transactions?categoryIds=${encodeURIComponent(categoryId)}&month=${monthParam}`;
};
