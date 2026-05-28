import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import EmptyCategoriesChart from '@/pages/Overview/TopSpendingCategories/EmptyCategoriesChart';
import TopCategoriesChart from '@/pages/Overview/TopSpendingCategories/TopCategoriesChart';
import { getTopSpendingCategories } from '@/utils/entities/category';
import { buildTransactionsDrilldownUrl } from '@/utils/navigation/transactionsDrilldown';

const MAX_ITEMS = 5;

const TopSpendingCategories = () => {
  const { date, year, month } = useOverviewFilters();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(year, month);
  const navigate = useNavigate();
  const isLoading = isCategoriesLoading || isTransactionsLoading;

  const chartData = useMemo(() => {
    if (!categories || !transactions) {
      return [];
    }

    return getTopSpendingCategories(transactions, categories, MAX_ITEMS);
  }, [categories, transactions]);

  const goToCategoryTransactions = (categoryId: string) => {
    navigate(buildTransactionsDrilldownUrl(categoryId, date));
  };

  if (chartData.length === 0 && !isLoading) {
    return <EmptyCategoriesChart />;
  }

  return (
    <TopCategoriesChart
      chartData={chartData}
      isLoading={isLoading}
      onBarClick={goToCategoryTransactions}
    />
  );
};

export default TopSpendingCategories;
