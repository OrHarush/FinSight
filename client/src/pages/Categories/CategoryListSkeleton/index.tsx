import { Grid, Typography } from '@mui/material';
import CategoryCardSkeleton from '@/pages/Categories/CategoryListSkeleton/CategoryCardSkeleton';
import { useTranslation } from 'react-i18next';

const CategoryListSkeleton = () => {
  const { t } = useTranslation('categories');

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          {t('incomeCategories')}
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map(i => (
            <Grid key={`income-${i}`} size={{ xs: 12, sm: 6 }}>
              <CategoryCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          {t('expenseCategories')}
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Grid key={`expense-${i}`} size={{ xs: 12, sm: 6 }}>
              <CategoryCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoryListSkeleton;
