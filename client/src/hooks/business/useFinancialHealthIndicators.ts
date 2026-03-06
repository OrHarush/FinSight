import { useTranslation } from 'react-i18next';
import { calculateBudgetRunway, calculateFinancialHealth } from '@/utils/financialHealth';
import { HealthIndicator } from '@/utils/healthIndicatorUtils';

interface UseFinancialHealthIndicatorsParams {
  income: number;
  expenses: number;
  hasMonthData: boolean;
}

export const useFinancialHealthIndicators = ({
  income,
  expenses,
  hasMonthData,
}: UseFinancialHealthIndicatorsParams): HealthIndicator[] => {
  const { t } = useTranslation('overview');
  const today = new Date();
  const indicators: HealthIndicator[] = [];

  if (!hasMonthData) {
    indicators.push({
      title: t('financialStatusCard.title'),
      value: t('noData.title'),
      description: t('noData.detail'),
      status: 'noData',
    });
    return indicators;
  }

  const { status } = calculateFinancialHealth(income, expenses, today);
  indicators.push({
    title: t('financialStatusCard.title'),
    value: t(`financialStatusCard.status.${status}`),
    status,
  });

  if (income <= 0) {
    return indicators;
  }

  const day = today.getDate();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const runway = calculateBudgetRunway({
    income,
    expenses,
    dayOfMonth: day,
    totalDaysInMonth: totalDays,
  });

  indicators.push({
    title: t('budgetRunwayCard.title'),
    value:
      runway.status === 'critical'
        ? t('budgetRunwayCard.noRunway')
        : runway.status === 'warning'
          ? t('budgetRunwayCard.daysLeft', { count: runway.daysLeft })
          : t('budgetRunwayCard.onTrack'),
    status: runway.status,
  });

  const remainingDays = Math.max(totalDays - day, 1);
  const dailyLimit = (income - expenses) / remainingDays;
  const currentDailyBurn = expenses / day;

  indicators.push({
    title: t('dailySpendCard.title'),
    value: t('dailySpendCard.valuePerDay', {
      amount: Math.round(dailyLimit),
    }),
    status: currentDailyBurn > dailyLimit ? 'warning' : 'ok',
  });

  return indicators;
};
