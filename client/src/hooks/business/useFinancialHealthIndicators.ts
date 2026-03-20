import { useTranslation } from 'react-i18next';

import { analyzeFinancialHealth, FinancialSnapshot, InsightKey } from '@/utils/financialHealth';
import { HealthIndicator } from '@/utils/healthIndicatorUtils';

interface UseFinancialHealthIndicatorsParams {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  hasMonthData: boolean;
}

interface FinancialHealthIndicatorsResult {
  indicators: HealthIndicator[];
  insightKey: InsightKey;
}

export const useFinancialHealthIndicators = ({
  income,
  fixedExpenses,
  variableExpenses,
  hasMonthData,
}: UseFinancialHealthIndicatorsParams): FinancialHealthIndicatorsResult => {
  const { t } = useTranslation('overview');
  const today = new Date();

  if (!hasMonthData) {
    return {
      indicators: [
        {
          title: t('financialStatusCard.title'),
          value: t('noData.title'),
          description: t('noData.detail'),
          status: 'noData',
        },
      ],
      insightKey: 'balanced',
    };
  }

  const snap: FinancialSnapshot = {
    income,
    fixedExpenses,
    variableExpenses,
    dayOfMonth: today.getDate(),
    totalDaysInMonth: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
  };

  const { dailyVariableBurn, dailyAllowance, runwayDays, healthStatus, insightKey } =
    analyzeFinancialHealth(snap);

  const statusIndicator: HealthIndicator = {
    title: t('financialStatusCard.title'),
    value: t(`financialStatusCard.status.${healthStatus}`),
    status: healthStatus,
  };

  if (income <= 0) {
    return { indicators: [statusIndicator], insightKey };
  }

  const runwayIndicator: HealthIndicator = {
    title: t('budgetRunwayCard.title'),
    value:
      runwayDays === null
        ? t('budgetRunwayCard.onTrack')
        : runwayDays <= 0
          ? t('budgetRunwayCard.noRunway')
          : t('budgetRunwayCard.daysLeft', { count: runwayDays }),
    status:
      runwayDays === null
        ? 'ok'
        : runwayDays <= 3
          ? 'critical'
          : runwayDays <= 7
            ? 'warning'
            : 'ok',
  };

  const dailyIndicator: HealthIndicator = {
    title: t('dailySpendCard.title'),
    value: t('dailySpendCard.valuePerDay', { amount: Math.max(Math.round(dailyAllowance), 0) }),
    status: dailyVariableBurn > dailyAllowance * 1.2 ? 'warning' : 'ok',
  };

  return { indicators: [statusIndicator, runwayIndicator, dailyIndicator], insightKey };
};
