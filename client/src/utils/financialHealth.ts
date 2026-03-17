export type InsightKey = 'excellent' | 'good' | 'balanced' | 'overspent';
export type HealthStatus = 'ok' | 'warning' | 'critical' | 'noData';

export interface FinancialSnapshot {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  dayOfMonth: number;
  totalDaysInMonth: number;
}

export interface FinancialAnalysis {
  availableBudget: number;
  spentExpenses: number;
  remainingBudget: number;
  dailyVariableBurn: number;
  dailyAllowance: number;
  daysLeft: number;
  runwayDays: number | null;
  insightKey: InsightKey;
  healthStatus: HealthStatus;
}

export function analyzeFinancialHealth(snap: FinancialSnapshot): FinancialAnalysis {
  const { income, fixedExpenses, variableExpenses, dayOfMonth, totalDaysInMonth } = snap;

  const daysElapsed = Math.max(dayOfMonth, 1);
  const daysLeft = Math.max(totalDaysInMonth - dayOfMonth, 1);

  const availableBudget = Math.max(income - fixedExpenses, 0);
  const spentExpenses = variableExpenses;
  const remainingBudget = availableBudget - spentExpenses;

  const dailyVariableBurn = spentExpenses / daysElapsed;
  const dailyAllowance = remainingBudget / daysLeft;

  const runwayDays = dailyVariableBurn > 0 ? Math.floor(remainingBudget / dailyVariableBurn) : null;

  const insightKey = ((): InsightKey => {
    if (remainingBudget <= 0) return 'overspent';
    const projectedEndBalance = remainingBudget - dailyVariableBurn * daysLeft;
    if (
      projectedEndBalance >= 0 &&
      remainingBudget / (remainingBudget + dailyVariableBurn * daysLeft || 1) >= 0.3
    )
      return 'excellent';
    if (projectedEndBalance >= 0) return 'good';
    if (projectedEndBalance >= -(dailyVariableBurn * daysLeft * 0.1)) return 'balanced';
    return 'overspent';
  })();

  const healthStatus = ((): HealthStatus => {
    if (income === 0) return 'noData';
    if (insightKey === 'overspent') return 'critical';
    if (insightKey === 'balanced') return 'warning';
    if (dailyVariableBurn > dailyAllowance * 1.5) return 'warning';
    return 'ok';
  })();

  return {
    availableBudget,
    spentExpenses,
    remainingBudget,
    dailyVariableBurn,
    dailyAllowance,
    daysLeft,
    runwayDays,
    insightKey,
    healthStatus,
  };
}
