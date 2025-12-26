import { Grid, Typography } from '@mui/material';
import CategoryCardSkeleton from '@/pages/Categories/CategoryListSkeleton/CategoryCardSkeleton';
import { useTranslation } from 'react-i18next';

const CategoryListSkeleton = () => {
  const { t } = useTranslation('categories');

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom color={'textSecondary'}>
          {t('incomeCategories')}
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map(i => (
            <CategoryCardSkeleton key={`income-${i}`} />
          ))}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom color={'textSecondary'}>
          {t('expenseCategories')}
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map(i => (
            <CategoryCardSkeleton key={`expense-${i}`} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoryListSkeleton;
