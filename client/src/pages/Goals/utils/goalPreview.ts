const monthlyRate = (annualReturnPct: number) => annualReturnPct / 100 / 12;

export const monthsBetweenUtc = (from: Date, to: Date) => {
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();

  return Math.max(years * 12 + months, 0);
};

export const addMonthsUtc = (from: Date, months: number) =>
  new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + months, from.getUTCDate()));

export const startOfTodayUtc = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const computeRawRequiredMonthlyContribution = (
  currentValue: number,
  targetAmount: number,
  monthsRemaining: number,
  annualReturnPct: number
): number => {
  const remaining = targetAmount - currentValue;

  if (monthsRemaining <= 0) {
    return Math.max(remaining, 0);
  }

  if (remaining <= 0) {
    return 0;
  }

  const r = monthlyRate(annualReturnPct);

  if (r === 0) {
    return remaining / monthsRemaining;
  }

  const growth = Math.pow(1 + r, monthsRemaining);
  const fvOfCurrent = currentValue * growth;
  const pmt = ((targetAmount - fvOfCurrent) * r) / (growth - 1);

  return Math.max(pmt, 0);
};

export const requiredMonthlyContribution = (
  currentValue: number,
  targetAmount: number,
  monthsRemaining: number,
  annualReturnPct: number
): number =>
  Math.ceil(
    computeRawRequiredMonthlyContribution(
      currentValue,
      targetAmount,
      monthsRemaining,
      annualReturnPct
    )
  );
