import CategoryCard from '@/pages/Categories/CategoryCard';
import { Grid, Typography } from '@mui/material';
import { useCategories } from '@/providers/EntitiesProviders/CategoriesProvider';
import CategoryListSkeleton from '@/pages/Categories/Skeletons/CategoryListSkeleton';
import { CategoryDto } from '@/types/CategoryDto';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import CategoryIcon from '@mui/icons-material/Category';

interface CategoryListProps {
  selectCategory: (category: CategoryDto) => void;
}

const CategoryList = ({ selectCategory }: CategoryListProps) => {
  const { categories, isLoading } = useCategories();
  const expenseCategories = categories.filter(c => c.type.toLowerCase() === 'expense');
  const incomeCategories = categories.filter(c => c.type.toLowerCase() === 'income');

  return isLoading ? (
    <CategoryListSkeleton />
  ) : categories.length ? (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Income Categories
        </Typography>
        <Grid container spacing={2}>
          {incomeCategories.map(category => (
            <Grid key={category._id} size={{ xs: 12, sm: 6 }}>
              <CategoryCard category={category} selectCategory={selectCategory} />
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
              <CategoryCard category={category} selectCategory={selectCategory} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <EntityEmpty
      entityName={'categories'}
      subtitle={'Add your first category to organize transactions'}
      icon={CategoryIcon}
    />
  );
};

export default CategoryList;
