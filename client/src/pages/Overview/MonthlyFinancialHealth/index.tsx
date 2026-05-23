import dayjs from 'dayjs';

import FullVariant from '@/components/features/overview/FullVariant';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFinancialHealthIndicators } from '@/hooks/business/useFinancialHealthIndicators';
import { useFetch } from '@/hooks/common/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useTransactions } from '@/hooks/entities/useTransactions';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';
import MonthlyFinancialHealthSkeleton from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthSkeleton';
import BuildingVariant from '@/pages/Overview/MonthlyFinancialHealth/variants/BuildingVariant';
import NoDataVariant from '@/pages/Overview/MonthlyFinancialHealth/variants/NoDataVariant';
import NoIncomeVariant from '@/pages/Overview/MonthlyFinancialHealth/variants/NoIncomeVariant';
import RetrospectiveVariant from '@/pages/Overview/MonthlyFinancialHealth/variants/RetrospectiveVariant';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { TransactionSummaryDto } from '@/types/Transaction';
import {
  countSpendFreeDays,
  countUniqueSpendingDays,
  findMostExpensiveDay,
  splitExpenses,
} from '@/utils/entities/transaction';

const MonthlyFinancialHealth = () => {
  const { year, month, account, date } = useOverviewFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);

  const { data, isLoading: isLoadingSummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month + 1, account?._id),
    queryKey: queryKeys.transactionSummary(year, month + 1, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const isLoading = isLoadingSummary || isLoadingAccounts || isLoadingTransactions;

  const isPastMonth = date.isBefore(dayjs().startOf('month'));
  const daysInMonth = date.daysInMonth();
  const income = data?.monthlyIncome ?? 0;
  const accountId = account?._id ?? '';
  const hasMonthData = transactions.filter(tx => tx.account?._id === accountId).length > 0;
  const { fixedExpenses, variableExpenses } = splitExpenses(transactions, accountId);
  const uniqueSpendingDays = countUniqueSpendingDays(transactions, accountId);
  const mostExpensiveDay = findMostExpensiveDay(transactions, accountId);
  const spendFreeDays = countSpendFreeDays(transactions, accountId, daysInMonth);

  const variant = useFinancialHealthIndicators({
    income,
    fixedExpenses,
    variableExpenses,
    hasMonthData,
    uniqueSpendingDays,
    isPastMonth,
    daysInMonth,
    mostExpensiveDay,
    spendFreeDays,
  });

  if (isLoading) {
    return <MonthlyFinancialHealthSkeleton />;
  }

  return (
    <MonthlyFinancialHealthCard>
      {variant.type === 'noData' && <NoDataVariant />}
      {variant.type === 'noIncome' && <NoIncomeVariant />}
      {variant.type === 'building' && (
        <BuildingVariant
          uniqueSpendingDays={variant.uniqueSpendingDays}
          daysUntilReady={variant.daysUntilReady}
        />
      )}
      {variant.type === 'full' && (
        <FullVariant insightKey={variant.insightKey} tiles={variant.tiles} />
      )}
      {variant.type === 'retrospective' && (
        <RetrospectiveVariant date={date} summary={variant.summary} />
      )}
    </MonthlyFinancialHealthCard>
  );
};

export default MonthlyFinancialHealth;
