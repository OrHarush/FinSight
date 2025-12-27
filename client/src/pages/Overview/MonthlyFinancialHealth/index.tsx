import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useFetch } from '@/hooks/useFetch';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import {
  calculateFinancialHealth,
  FinancialHealthStatus,
  HEALTH_SEVERITY_ORDER,
} from '@/utils/financialHealth';
import OverallHealthIcon from './OverallHealthIcon';
import HealthIndicatorCell from './HealthIndicatorCell';
import MonthlyFinancialHealthSkeleton from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthSkeleton';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';

interface HealthIndicator {
  title: string;
  value: string;
  description?: string;
  status: FinancialHealthStatus;
}

const resolveOverallSeverity = (indicators: HealthIndicator[]): FinancialHealthStatus =>
  indicators.reduce<FinancialHealthStatus>((worst, current) => {
    const worstIndex = HEALTH_SEVERITY_ORDER.indexOf(worst);
    const currentIndex = HEALTH_SEVERITY_ORDER.indexOf(current.status);

    return currentIndex > worstIndex ? current.status : worst;
  }, 'noData');

const MonthlyFinancialHealth = () => {
  const { t } = useTranslation('overview');
  const { year, month, account } = useOverviewFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);

  const { data, isLoading: isLoadingSummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const isLoading = isLoadingSummary || isLoadingAccounts || isLoadingTransactions;

  if (isLoading) {
    return <MonthlyFinancialHealthSkeleton />;
  }

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;
  const hasMonthData = transactions.filter(tx => tx.account?._id === account?._id).length > 0;
  const today = new Date();

  const indicators: HealthIndicator[] = [];

  if (!hasMonthData) {
    indicators.push({
      title: t('financialStatusCard.title'),
      value: t('noData.title'),
      description: t('noData.detail'),
      status: 'noData',
    });
  } else {
    const { status } = calculateFinancialHealth(income, expenses, today);
    indicators.push({
      title: t('financialStatusCard.title'),
      value: t(`financialStatusCard.status.${status}`),
      status,
    });
  }

  if (income > 0) {
    const day = today.getDate();
    const dailyBurn = expenses / day;
    const remainingBudget = income - expenses;
    const daysLeft = dailyBurn > 0 ? Math.floor(remainingBudget / dailyBurn) : Infinity;
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    indicators.push({
      title: t('budgetRunwayCard.title'),
      value:
        daysLeft <= 0
          ? t('budgetRunwayCard.noRunway')
          : daysLeft < totalDays - day
            ? t('budgetRunwayCard.daysLeft', { count: daysLeft })
            : t('budgetRunwayCard.onTrack'),
      status: daysLeft <= 0 ? 'critical' : daysLeft < totalDays - day ? 'warning' : 'ok',
    });
  }

  if (income > 0) {
    const day = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
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
  }

  const overallStatus = resolveOverallSeverity(indicators);
  const hasNoData = indicators.length === 1 && indicators[0].status === 'noData';

  return (
    <MonthlyFinancialHealthCard>
      <Grid container height={'100%'} spacing={2} alignItems={'center'}>
        <Grid size={{ xs: 12, sm: 3, md: 12, lg: 3 }} justifyItems={'center'}>
          <OverallHealthIcon status={overallStatus} />
        </Grid>
        <Grid container size={{ xs: 12, sm: 9, md: 12, lg: 9 }} justifyItems={'center'}>
          {indicators.map((i, idx) => (
            <Grid key={idx} size={{ xs: hasNoData ? 12 : 4 }} textAlign={'center'}>
              <HealthIndicatorCell
                key={idx}
                title={i.title}
                value={i.value}
                description={i.description}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </MonthlyFinancialHealthCard>
  );
};

export default MonthlyFinancialHealth;
