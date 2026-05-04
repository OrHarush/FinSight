import { useTranslation } from 'react-i18next';

import {
  analyzeFinancialHealth,
  FinancialSnapshot,
  HealthStatus,
  InsightKey,
} from '@/hooks/business/analyzeFinancialHealth';

export interface HealthTile {
  label: string;
  value: string;
  description: string;
  danger?: boolean;
}

export interface RetrospectiveSummary {
  dailyAverage: number;
  mostExpensiveDay: { day: number; amount: number } | null;
  spendFreeDays: number;
  daysInMonth: number;
}

export type HealthCardVariant =
  | { type: 'noData' }
  | { type: 'noIncome' }
  | { type: 'building'; uniqueSpendingDays: number; daysUntilReady: number }
  | { type: 'full'; insightKey: InsightKey; healthStatus: HealthStatus; tiles: HealthTile[] }
  | { type: 'retrospective'; summary: RetrospectiveSummary };

interface UseFinancialHealthIndicatorsParams {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  hasMonthData: boolean;
  uniqueSpendingDays: number;
  isPastMonth: boolean;
  daysInMonth: number;
  mostExpensiveDay: { day: number; amount: number } | null;
  spendFreeDays: number;
}

export const useFinancialHealthIndicators = ({
  income,
  fixedExpenses,
  variableExpenses,
  hasMonthData,
  uniqueSpendingDays,
  isPastMonth,
  daysInMonth,
  mostExpensiveDay,
  spendFreeDays,
}: UseFinancialHealthIndicatorsParams): HealthCardVariant => {
  const { t } = useTranslation('overview');
  const today = new Date();

  if (!hasMonthData) {
    return { type: 'noData' };
  }

  if (isPastMonth) {
    const totalExpenses = fixedExpenses + variableExpenses;
    const dailyAverage = daysInMonth > 0 ? totalExpenses / daysInMonth : 0;

    return {
      type: 'retrospective',
      summary: { dailyAverage, mostExpensiveDay, spendFreeDays, daysInMonth },
    };
  }

  const daysUntilReady = 7 - uniqueSpendingDays;

  if (daysUntilReady > 0) {
    return { type: 'building', uniqueSpendingDays, daysUntilReady };
  }

  if (income <= 0) {
    return { type: 'noIncome' };
  }

  const snap: FinancialSnapshot = {
    income,
    fixedExpenses,
    variableExpenses,
    dayOfMonth: today.getDate(),
    totalDaysInMonth: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
  };

  const {
    dailyAllowance,
    runwayDays,
    daysLeft,
    remainingBudget,
    projectedEndBalance,
    healthStatus,
    insightKey,
  } = analyzeFinancialHealth(snap);

  const isCritical = healthStatus === 'critical';

  if (isCritical) {
    const overBudgetTile: HealthTile = {
      label: t('overBudgetCard.title'),
      value: t('overBudgetCard.amount', { amount: Math.abs(Math.round(remainingBudget)) }),
      description: t('overBudgetCard.description'),
      danger: true,
    };

    return { type: 'full', insightKey, healthStatus, tiles: [overBudgetTile] };
  }

  if (insightKey === 'atRisk') {
    const projectedOverspendTile: HealthTile = {
      label: t('projectedOverspendCard.title'),
      value: t('projectedOverspendCard.amount', {
        amount: Math.abs(Math.round(projectedEndBalance)),
      }),
      description: t('projectedOverspendCard.description'),
      danger: true,
    };

    const dailyAllowanceTile: HealthTile = {
      label: t('dailySpendCard.title'),
      value: t('dailySpendCard.valuePerDay', { amount: Math.max(Math.round(dailyAllowance), 0) }),
      description: t('dailySpendCard.toStayWithinBudget'),
    };

    return {
      type: 'full',
      insightKey,
      healthStatus,
      tiles: [projectedOverspendTile, dailyAllowanceTile],
    };
  }

  const runwayTile: HealthTile = {
    label: t('budgetRunwayCard.title'),
    value:
      runwayDays === null
        ? t('budgetRunwayCard.onTrack')
        : runwayDays >= daysLeft
          ? t('budgetRunwayCard.enoughForMonth')
          : t('budgetRunwayCard.daysLeft', { count: runwayDays }),
    description:
      runwayDays === null || runwayDays >= daysLeft
        ? t('budgetRunwayCard.enoughForMonthDesc')
        : t('budgetRunwayCard.atBurnRate'),
  };

  const dailySpendTile: HealthTile = {
    label: t('dailySpendCard.title'),
    value: t('dailySpendCard.valuePerDay', { amount: Math.max(Math.round(dailyAllowance), 0) }),
    description: t('dailySpendCard.toUseRemainingBudget'),
  };

  return { type: 'full', insightKey, healthStatus, tiles: [runwayTile, dailySpendTile] };
};
