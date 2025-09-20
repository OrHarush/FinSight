import { Grid, Typography } from '@mui/material';
import CategoryCardSkeleton from '@/pages/Categories/Skeletons/CategoryCardSkeleton';

const CategoryListSkeleton = () => {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Income Categories
        </Typography>
        <Grid container spacing={2}>
          {[1, 2].map(i => (
            <Grid key={`income-${i}`} size={{ xs: 12, sm: 6 }}>
              <CategoryCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Expense Categories
        </Typography>
        <Grid container spacing={2}>
          {[1, 2].map(i => (
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
