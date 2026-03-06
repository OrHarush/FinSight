import { useMemo } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useBudgets } from '@/hooks/entities/useBudgets';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import CategoriesBudgetSkeleton from '@/pages/Overview/CategoriesBudgets/CategoryBudgetSkeleton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import BudgetList from '@/pages/Overview/CategoriesBudgets/BudgetList';

const CategoriesBudgets = () => {
  const { t } = useTranslation('overview');
  const navigate = useNavigate();
  const { year, month } = useOverviewFilters();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);
  const { budgets, isLoading: isLoadingBudgets } = useBudgets(year, month);

  const isLoading = isLoadingCategories || isLoadingTransactions || isLoadingBudgets;

  const watchedCategories = useMemo(() => {
    if (!categories || !transactions || !budgets) return [];

    const budgetMap = new Map(budgets.map(b => [b.categoryId, b.limit]));
    const spentMap = new Map<string, number>();

    transactions.forEach(tx => {
      if (tx.category?.type === 'Expense') {
        spentMap.set(tx.category._id, (spentMap.get(tx.category._id) ?? 0) + tx.amount);
      }
    });

    return categories
      .filter(c => c.type === 'Expense' && budgetMap.has(c._id))
      .map(c => {
        const spent = spentMap.get(c._id) ?? 0;
        const limit = budgetMap.get(c._id)!;
        const percent = (spent / limit) * 100;

        return {
          id: c._id,
          name: c.name,
          icon: c.icon,
          color: c.color,
          spent,
          limit,
          percent,
        };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [categories, transactions, budgets]);

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
            {watchedCategories.length === 0 ? (
              <Column height={'100%'} alignItems="center" justifyContent="center" spacing={2}>
                <Typography color="text.secondary">{t('budgetWatch.noBudgets')}</Typography>
                <Button variant="contained" onClick={() => navigate(ROUTES.CATEGORIES_URL)}>
                  {t('budgetWatch.addBudgetCTA')}
                </Button>
              </Column>
            ) : (
              <BudgetList budgets={watchedCategories} />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoriesBudgets;
