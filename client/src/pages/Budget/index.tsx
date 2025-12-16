import { useMemo } from 'react';
import { Box, Grid, Typography, Card, CardContent, Skeleton, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import BudgetCategoryCard from '@/pages/Budget/BudgetCategoryCard';
import PageLayout from '@/components/layout/Page/PageLayout';
import PageHeader from '@/components/layout/Page/PageHeader';
import BudgetPieChart from '@/pages/Budget/BudgetPieChart';

const Budget = () => {
  const { t } = useTranslation('categories');
  // const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();
  const {
    transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions(currentYear, currentMonth);

  const { totalSpent, totalBudget, perCategorySpent } = useMemo(() => {
    let totalSpentAcc = 0;
    let totalBudgetAcc = 0;
    const map = new Map<string, number>();

    transactions.forEach(tx => {
      if (tx.category && tx.category.type === 'Expense') {
        totalSpentAcc += tx.amount;
        const id = tx.category._id;
        map.set(id, (map.get(id) ?? 0) + tx.amount);
      }
    });

    categories?.forEach(cat => {
      if (cat.monthlyLimit) {
        totalBudgetAcc += cat.monthlyLimit;
      }
    });

    return {
      totalSpent: totalSpentAcc,
      totalBudget: totalBudgetAcc,
      perCategorySpent: map,
    };
  }, [transactions, categories]);

  // const handleCategorySelect = (category: CategoryDto) => {
  //   setSelectedCategory(category);
  // };
  //
  // const handleCloseDetails = () => setSelectedCategory(null);

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader title={'Budget'} />
      {/* Errors */}
      {categoriesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('messages.categoriesLoadError', 'Failed to load categories')}
        </Alert>
      )}
      {transactionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('messages.transactionsLoadError', 'Failed to load transactions')}
        </Alert>
      )}
      <Box mb={3}>
        {isLoading ? (
          <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
        ) : (
          <Card
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          >
            <CardContent>
              <Row justifyContent="space-between" alignItems="center">
                <Column spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('budgetPage.summary.totalSpent', 'Total spent this month')}
                  </Typography>
                  <Typography variant="h6">₪{totalSpent.toLocaleString()}</Typography>
                </Column>
                <Column spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('budgetPage.summary.totalBudget', 'Total budget')}
                  </Typography>
                  <Typography variant="h6">
                    {totalBudget
                      ? `₪${totalBudget.toLocaleString()}`
                      : t('budgetPage.noTotalBudget', 'No budgets set')}
                  </Typography>
                </Column>
                {totalBudget > 0 && (
                  <Column spacing={0.5} alignItems="flex-end">
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('budgetPage.summary.remaining', 'Remaining')}
                    </Typography>
                    <Typography variant="h6">
                      ₪{(totalBudget - totalSpent).toLocaleString()}
                    </Typography>
                  </Column>
                )}
              </Row>
            </CardContent>
          </Card>
        )}
      </Box>
      <Card sx={{ borderRadius: 2, p: 2 }}>
        <BudgetPieChart categories={categories} perCategorySpent={perCategorySpent} />
      </Card>
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Column spacing={2} height={'400px'} overflow={'auto'}>
          {categories?.map(category => (
            <BudgetCategoryCard key={category._id} category={category} />
          ))}
          {!categories?.length && (
            <Box mt={4} width="100%" textAlign="center">
              <Typography variant="body1" color="text.secondary">
                {t('budgetPage.empty', 'No categories yet. Create one to start budgeting.')}
              </Typography>
            </Box>
          )}
        </Column>
      )}
    </PageLayout>
  );
};

export default Budget;
