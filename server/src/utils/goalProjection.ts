export interface ProjectionPoint {
  date: string;
  value: number;
  type: 'actual' | 'projected';
}

const monthlyRate = (annualReturnPct: number) => annualReturnPct / 100 / 12;

const ceilCentsToWholeUnit = (cents: number) => Math.ceil(cents / 100) * 100;

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
  ceilCentsToWholeUnit(
    computeRawRequiredMonthlyContribution(
      currentValue,
      targetAmount,
      monthsRemaining,
      annualReturnPct
    )
  );

export const projectFinalValue = (
  currentValue: number,
  monthlyContribution: number,
  monthsRemaining: number,
  annualReturnPct: number
): number => {
  if (monthsRemaining <= 0) {
    return currentValue;
  }

  const r = monthlyRate(annualReturnPct);
  let value = currentValue;

  for (let i = 0; i < monthsRemaining; i++) {
    value = value * (1 + r) + monthlyContribution;
  }

  return value;
};

const formatYearMonth = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');

  return `${y}-${m}`;
};

const addMonthsUtc = (d: Date, n: number) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));

export const buildProjectionPoints = (
  startValue: number,
  monthlyContribution: number,
  monthsRemaining: number,
  annualReturnPct: number,
  pastContributionsByMonth: Array<{ month: string; amount: number }>,
  startMonth: Date
): ProjectionPoint[] => {
  const points: ProjectionPoint[] = [];

  const sortedPast = [...pastContributionsByMonth].sort((a, b) => a.month.localeCompare(b.month));

  let runningActual = 0;

  for (const entry of sortedPast) {
    runningActual += entry.amount;
    points.push({ date: entry.month, value: runningActual, type: 'actual' });
  }

  if (monthsRemaining <= 0) {
    return points;
  }

  const r = monthlyRate(annualReturnPct);
  let value = startValue;

  for (let i = 1; i <= monthsRemaining; i++) {
    value = value * (1 + r) + monthlyContribution;
    const pointDate = addMonthsUtc(startMonth, i);
    points.push({ date: formatYearMonth(pointDate), value, type: 'projected' });
  }

  return points;
};
