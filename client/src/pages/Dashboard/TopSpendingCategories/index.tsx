import { useMemo } from 'react';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { getTopSpendingCategories } from '@/utils/categoryUtils';
import TopSpendingCategoriesSkeleton from '@/pages/Dashboard/TopSpendingCategories/TopSpendingCategoriesSkeleton';
import EmptyCategoriesChart from '@/pages/Dashboard/TopSpendingCategories/EmptyCategoriesChart';
import TopCategoriesChart from '@/pages/Dashboard/TopSpendingCategories/TopCategoriesChart';

const MAX_ITEMS = 5;

const TopSpendingCategories = () => {
  const { year, month } = useDashboardFilters();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(year, month);

  const chartData = useMemo(() => {
    if (!categories || !transactions) {
      return [];
    }

    return getTopSpendingCategories(transactions, categories, MAX_ITEMS);
  }, [categories, transactions]);

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  if (isLoading) {
    return <TopSpendingCategoriesSkeleton />;
  }

  if (chartData.length === 0) {
    return <EmptyCategoriesChart />;
  }

  return <TopCategoriesChart chartData={chartData} />;
};

export default TopSpendingCategories;
