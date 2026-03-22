import { Grid, Typography } from '@mui/material';

import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import CategoryCard from '@/pages/Categories/components/CategoryCard';
import { CategoryDto } from '@/types/Category';

interface CategoriesTypeSectionProps {
  title: string;
  categories: CategoryDto[];
  selectCategory: (category: CategoryDto) => void;
}

const CategoriesTypeSection = ({
  title,
  categories,
  selectCategory,
}: CategoriesTypeSectionProps) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h6" gutterBottom color={'textSecondary'}>
      {title}
    </Typography>
    <ScrollableColumn spacing={2} flex={1} minHeight={0} sx={{ pr: 0 }}>
      <Grid container spacing={2}>
        {categories.map(category => (
          <CategoryCard key={category._id} category={category} selectCategory={selectCategory} />
        ))}
      </Grid>
    </ScrollableColumn>
  </Grid>
);

export default CategoriesTypeSection;
