import { Grid } from '@mui/material';
import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { TransactionSummaryDto } from '@/types/Transaction';
import { getTopSpendingCategories } from '@/utils/categoryUtils';

import BudgetRunwayCard from './CurrentMonth/BudgetRunwayCard';
import DailySpendCard from './CurrentMonth/DailySpendCard';
import FinancialStatusCard from './CurrentMonth/FinancialStatusCard';
import BiggestOverspendCard from './MonthSummary/BiggestOverspendCard';
import MonthlyOutcomeCard from './MonthSummary/MonthlyOutcomeCard';
import NetResultCard from './MonthSummary/NetResultCard';

const FinancialHighlights = () => {
  const { year, month, account } = useOverviewFilters();
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

  const hasMonthData = (transactions.length ?? 0) > 0;

  return (
    <Grid container spacing={2}>
      {isCurrentMonth ? (
        <>
          <FinancialStatusCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
            hasMonthData={hasMonthData}
          />
          <BudgetRunwayCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
            hasMonthData={hasMonthData}
          />
          <DailySpendCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            isLoading={isLoading}
            hasMonthData={hasMonthData}
          />
        </>
      ) : (
        <>
          <MonthlyOutcomeCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            hasMonthData={hasMonthData}
            isLoading={isLoading}
          />
          <NetResultCard
            income={monthlyIncome}
            expenses={monthlyExpenses}
            hasMonthData={hasMonthData}
            isLoading={isLoading}
          />
          <BiggestOverspendCard
            categoryName={biggestOverspend?.name}
            overspendAmount={biggestOverspend?.amount}
            hasMonthData={hasMonthData}
            isLoading={isLoading}
          />
        </>
      )}
    </Grid>
  );
};

export default FinancialHighlights;
