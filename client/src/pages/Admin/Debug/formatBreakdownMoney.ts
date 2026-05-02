import { fromCents } from '@lyra/shared';

const formatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatBreakdownMoney = (cents: number): string => formatter.format(fromCents(cents));

export const formatSignedBreakdownMoney = (cents: number): string => {
  if (cents === 0) {
    return formatBreakdownMoney(0);
  }

  const sign = cents > 0 ? '+' : '−';
  const formatted = formatBreakdownMoney(Math.abs(cents));

  return `${sign}${formatted}`;
};
