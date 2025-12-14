import { Grid } from '@mui/material';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { useFetch } from '@/hooks/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useCategories } from '@/hooks/entities/useCategories';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import FinancialStatusCard from './CurrentMonth/FinancialStatusCard';
import DailySpendCard from './CurrentMonth/DailySpendCard';
import BudgetRunwayCard from './CurrentMonth/BudgetRunwayCard';
import MonthlyOutcomeCard from './MonthSummary/MonthlyOutcomeCard';
import NetResultCard from './MonthSummary/NetResultCard';
import BiggestOverspendCard from './MonthSummary/BiggestOverspendCard';
import { useMemo } from 'react';
import { getTopSpendingCategories } from '@/utils/categoryUtils';

const FinancialHighlights = () => {
  const { year, month, account } = useDashboardFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();

  const { data, isLoading: isLoadingSummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const monthlyIncome = data?.monthlyIncome ?? 0;
  const monthlyExpenses = data?.monthlyExpenses ?? 0;

  const isLoading =
    isLoadingSummary || isLoadingAccounts || isLoadingTransactions || isLoadingCategories;

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const biggestOverspend = useMemo(() => {
    if (!transactions || !categories) return null;

    const top = getTopSpendingCategories(transactions, categories, 1);
    return top.length > 0 ? top[0] : null;
  }, [transactions, categories]);

  return (
    <Grid container spacing={2} width="100%">
      {isCurrentMonth ? (
        <>
          <FinancialStatusCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
          />
          <BudgetRunwayCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
          />
          <DailySpendCard income={monthlyIncome} expenses={monthlyExpenses} isLoading={isLoading} />
        </>
      ) : (
        <>
          <MonthlyOutcomeCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
          />
          <NetResultCard income={monthlyIncome} expenses={monthlyExpenses} isLoading={isLoading} />
          <BiggestOverspendCard
            categoryName={biggestOverspend?.name}
            overspendAmount={biggestOverspend?.amount}
            isLoading={isLoading}
          />
        </>
      )}
    </Grid>
  );
};

export default FinancialHighlights;
