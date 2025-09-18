import EditIcon from '@mui/icons-material/Edit';
import CategoryCard from '@/pages/Categories/CategoryCard';
import { Grid, Typography } from '@mui/material';
import { useCategories } from '@/providers/CategoriesProovider';

const CategoryList = () => {
  const {categories} = useCategories();
  const expenseCategories = categories.filter(c => c.type.toLowerCase() === 'expense');
  const incomeCategories = categories.filter(c => c.type.toLowerCase() === 'income');

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Income Categories
        </Typography>
        <Grid container spacing={2}>
          {incomeCategories.map(category => (
            <Grid key={category._id} size={{ xs: 12, sm: 6 }}>
              <CategoryCard category={category} icon={EditIcon} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Expense Categories
        </Typography>
        <Grid container spacing={2}>
          {expenseCategories.map(category => (
            <Grid key={category._id} size={{ xs: 12, sm: 6 }}>
              <CategoryCard category={category} icon={EditIcon} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoryList;
