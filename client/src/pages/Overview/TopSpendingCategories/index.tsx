import { useMemo } from 'react';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { getTopSpendingCategories } from '@/utils/categoryUtils';
import EmptyCategoriesChart from '@/pages/Overview/TopSpendingCategories/EmptyCategoriesChart';
import TopCategoriesChart from '@/pages/Overview/TopSpendingCategories/TopCategoriesChart';

const MAX_ITEMS = 5;

const TopSpendingCategories = () => {
  const { year, month } = useOverviewFilters();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(year, month);
  const isLoading = isCategoriesLoading || isTransactionsLoading;

  const chartData = useMemo(() => {
    if (!categories || !transactions) {
      return [];
    }

    return getTopSpendingCategories(transactions, categories, MAX_ITEMS);
  }, [categories, transactions]);

  if (chartData.length === 0 && !isLoading) {
    return <EmptyCategoriesChart />;
  }

  return <TopCategoriesChart chartData={chartData} isLoading={isLoading} />;
};

export default TopSpendingCategories;
