import CategoryCard from '@/pages/Categories/CategoryCard';
import { Grid, Typography } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { useCategories } from '@/hooks/useCategories';

interface CategoryListProps {
  selectCategory: (category: CategoryDto) => void;
}

const CategoryList = ({ selectCategory }: CategoryListProps) => {
  const { categories } = useCategories();
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
            <CategoryCard key={category._id} category={category} selectCategory={selectCategory} />
          ))}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Expense Categories
        </Typography>
        <Grid container spacing={2}>
          {expenseCategories.map(category => (
            <CategoryCard key={category._id} category={category} selectCategory={selectCategory} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoryList;
