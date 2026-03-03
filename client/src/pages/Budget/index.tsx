import { useMemo, useState } from 'react';
import { Box, Typography, Card, Skeleton, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { CategoryDto } from '@/types/Category';
import Column from '@/components/shared/layout/containers/Column';
import BudgetCategoryCard from '@/pages/Budget/BudgetCategoryCard';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import BudgetPieChart from '@/pages/Budget/BudgetPieChart';
import CategoryTransactionsList from '@/pages/Budget/CategoryTransactionsList';

const Budget = () => {
  const { t } = useTranslation('categories');
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();
  const {
    transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions(currentYear, currentMonth);

  const { perCategorySpent } = useMemo(() => {
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

  const handleCategorySelect = (category: CategoryDto) => {
    setSelectedCategory(category);
  };

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  return (
    <PageLayout>
      <PageHeader title={'Budget'} />
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
      <Card sx={{ borderRadius: 2, p: 3, mb: 3, height: '45vh' }}>
        <BudgetPieChart
          categories={categories}
          perCategorySpent={perCategorySpent}
          onCategoryClick={handleCategorySelect}
        />
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' },
          gap: 2,
          height: '40vh',
        }}
      >
        <Card
          sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Categories</Typography>
          </Box>
          {isLoading ? (
            <Column spacing={2} sx={{ p: 2 }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              ))}
            </Column>
          ) : (
            <Column
              spacing={1}
              sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}
            >
              {categories?.map(category => (
                <BudgetCategoryCard
                  key={category._id}
                  category={category}
                  onSelect={handleCategorySelect}
                  isSelected={selectedCategory?._id === category._id}
                />
              ))}
              {!categories?.length && (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('budgetPage.empty', 'No categories yet.')}
                  </Typography>
                </Box>
              )}
            </Column>
          )}
        </Card>
        <Card
          sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Transactions</Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <CategoryTransactionsList
              category={selectedCategory}
              transactions={transactions}
              isLoading={isLoading}
            />
          </Box>
        </Card>
      </Box>
    </PageLayout>
  );
};

export default Budget;
