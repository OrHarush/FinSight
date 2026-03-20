import { Divider, Grid } from '@mui/material';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFinancialHealthIndicators } from '@/hooks/business/useFinancialHealthIndicators';
import { useFetch } from '@/hooks/common/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useTransactions } from '@/hooks/entities/useTransactions';
import HealthIndicatorsGrid from '@/pages/Overview/MonthlyFinancialHealth/HealthIndicatorsGrid';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';
import MonthlyFinancialHealthSkeleton from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthSkeleton';
import MonthlyInsight from '@/pages/Overview/MonthlyInsight';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { TransactionDto, TransactionSummaryDto } from '@/types/Transaction';
import { hasNoData } from '@/utils/healthIndicatorUtils';

function splitExpenses(transactions: TransactionDto[], accountId: string) {
  let fixedExpenses = 0;
  let variableExpenses = 0;

  for (const tx of transactions) {
    if (tx.account?._id !== accountId) {
      continue;
    }
    if (tx.type !== 'Expense') {
      continue;
    }

    const abs = Math.abs(tx.amount);

    if (tx.recurrence && tx.recurrence !== 'None') {
      fixedExpenses += abs;
    } else {
      variableExpenses += abs;
    }
  }

  return { fixedExpenses, variableExpenses };
}

const MonthlyFinancialHealth = () => {
  const { year, month, account } = useOverviewFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);

  const { data, isLoading: isLoadingSummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month + 1, account?._id),
    queryKey: queryKeys.transactionSummary(year, month + 1, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const isLoading = isLoadingSummary || isLoadingAccounts || isLoadingTransactions;

  const income = data?.monthlyIncome ?? 0;
  const hasMonthData = transactions.filter(tx => tx.account?._id === account?._id).length > 0;
  const { fixedExpenses, variableExpenses } = splitExpenses(transactions, account?._id ?? '');
  const { indicators, insightKey } = useFinancialHealthIndicators({
    income,
    fixedExpenses,
    variableExpenses,
    hasMonthData,
  });
  const isNoDataState = hasNoData(indicators);

  if (isLoading) {
    return <MonthlyFinancialHealthSkeleton />;
  }

  return (
    <MonthlyFinancialHealthCard>
      <Grid container height="100%" spacing={2} alignItems="center">
        <Grid size={{ xs: 12 }}>
          <MonthlyInsight insightKey={insightKey} />
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid container size={{ xs: 12 }}>
          <HealthIndicatorsGrid indicators={indicators} isNoDataState={isNoDataState} />
        </Grid>
      </Grid>
    </MonthlyFinancialHealthCard>
  );
};

export default MonthlyFinancialHealth;
