import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useCategories } from '@/hooks/entities/useCategories';
import CategoriesTypeSection from '@/pages/Categories/components/CategoriesTypeSection';
import { CategoryDto } from '@/types/Category';

interface CategoryListProps {
  selectCategory: (category: CategoryDto) => void;
}

const CategoryList = ({ selectCategory }: CategoryListProps) => {
  const { t } = useTranslation('categories');
  const { categories } = useCategories();

  const expenseCategories = categories.filter(c => c.type.toLowerCase() === 'expense');
  const incomeCategories = categories.filter(c => c.type.toLowerCase() === 'income');

  return (
    <Grid container spacing={4}>
      <CategoriesTypeSection
        title={t('incomeCategories')}
        categories={incomeCategories}
        selectCategory={selectCategory}
      />
      <CategoriesTypeSection
        title={t('expenseCategories')}
        categories={expenseCategories}
        selectCategory={selectCategory}
      />
    </Grid>
  );
};

export default CategoryList;
