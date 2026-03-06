import { Box, Card, Typography } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import BudgetCategoryCard from '@/pages/Budgets/BudgetCategoryCard';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import { useTranslation } from 'react-i18next';
import { useBudgets } from '@/hooks/entities/useBudgets';

interface CategoriesPanelProps {
  categories: CategoryDto[];
  selectedCategory: CategoryDto | null;
  isLoading: boolean;
  currentYear: number;
  currentMonth: number;
  onCategorySelect: (category: CategoryDto) => void;
}

const CategoriesPanel = ({
  categories,
  selectedCategory,
  isLoading,
  currentYear,
  currentMonth,
  onCategorySelect,
}: CategoriesPanelProps) => {
  const { t } = useTranslation('budget');
  const { budgets } = useBudgets(currentYear, currentMonth);

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: '400px', sm: '350px', md: 'auto' },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">{t('categories.title')}</Typography>
      </Box>
      {isLoading ? (
        <CategoriesLoadingSkeleton />
      ) : (
        <ScrollableColumn spacing={1} maxHeight="100%" sx={{ flex: 1, p: 2 }}>
          {categories?.length > 0 ? (
            categories.map(category => (
              <BudgetCategoryCard
                key={category._id}
                category={category}
                onSelect={onCategorySelect}
                isSelected={selectedCategory?._id === category._id}
                year={currentYear}
                month={currentMonth}
                budgets={budgets}
              />
            ))
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('categories.empty')}
              </Typography>
            </Box>
          )}
        </ScrollableColumn>
      )}
    </Card>
  );
};

export default CategoriesPanel;
