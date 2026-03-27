export type InsightKey = 'excellent' | 'good' | 'balanced' | 'atRisk' | 'overspent';
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
  projectedEndBalance: number;
  dailyVariableBurn: number;
  dailyAllowance: number;
  daysLeft: number;
  runwayDays: number | null;
  insightKey: InsightKey;
  healthStatus: HealthStatus;
}

export const analyzeFinancialHealth = (snap: FinancialSnapshot): FinancialAnalysis => {
  const { income, fixedExpenses, variableExpenses, dayOfMonth, totalDaysInMonth } = snap;

  const daysElapsed = Math.max(dayOfMonth, 1);
  const daysLeft = Math.max(totalDaysInMonth - dayOfMonth, 1);

  const availableBudget = Math.max(income - fixedExpenses, 0);
  const spentExpenses = variableExpenses;
  const remainingBudget = availableBudget - spentExpenses;

  const dailyVariableBurn = spentExpenses / daysElapsed;
  const dailyAllowance = remainingBudget / daysLeft;

  const runwayDays = dailyVariableBurn > 0 ? Math.floor(remainingBudget / dailyVariableBurn) : null;

  const projectedEndBalance = remainingBudget - dailyVariableBurn * daysLeft;

  const insightKey = ((): InsightKey => {
    if (remainingBudget <= 0) {
      return 'overspent';
    }

    if (projectedEndBalance < 0) {
      return 'atRisk';
    }

    const bufferRatio = remainingBudget / (remainingBudget + dailyVariableBurn * daysLeft || 1);

    if (bufferRatio >= 0.3) {
      return 'excellent';
    }

    if (bufferRatio >= 0.1) {
      return 'good';
    }

    return 'balanced';
  })();

  const healthStatus = ((): HealthStatus => {
    if (income === 0) return 'noData';
    if (insightKey === 'overspent') return 'critical';
    if (insightKey === 'atRisk') return 'warning';
    if (insightKey === 'balanced') return 'warning';
    return 'ok';
  })();

  return {
    availableBudget,
    spentExpenses,
    remainingBudget,
    projectedEndBalance,
    dailyVariableBurn,
    dailyAllowance,
    daysLeft,
    runwayDays,
    insightKey,
    healthStatus,
  };
};
