import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useBudgets } from '@/hooks/entities/useBudgets';
import { useSortedBudgetCategories } from '@/hooks/business/useSortedBudgetCategories';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import CategoriesBudgetSkeleton from '@/pages/Overview/CategoriesBudgets/CategoryBudgetSkeleton';
import BudgetList from '@/pages/Overview/CategoriesBudgets/BudgetList';
import NoBudgetsEmptyCTA from '@/pages/Overview/CategoriesBudgets/NoBudgetsEmptyCTA';

const CategoriesBudgets = () => {
  const { t } = useTranslation('overview');
  const { year, month } = useOverviewFilters();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);
  const { budgets, isLoading: isLoadingBudgets } = useBudgets(year, month);

  const isLoading = isLoadingCategories || isLoadingTransactions || isLoadingBudgets;

  const sortedBudgets = useSortedBudgetCategories(categories, transactions, budgets);

  if (isLoading) {
    return <CategoriesBudgetSkeleton />;
  }

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent sx={{ height: '100%' }}>
          <Column height={'100%'} spacing={2}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {t('budgetWatch.title')}
            </Typography>
            {sortedBudgets.length === 0 ? (
              <NoBudgetsEmptyCTA />
            ) : (
              <BudgetList budgets={sortedBudgets} />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoriesBudgets;
