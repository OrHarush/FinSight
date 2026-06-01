import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
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
}: CategoriesTypeSectionProps) => {
  const { t } = useTranslation('categories');

  return (
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h6" color={'textSecondary'}>
      {title}
    </Typography>
    <Row spacing={0.5} alignItems="center" sx={{ mb: 1, opacity: 0.6 }}>
      <InfoOutlinedIcon sx={{ fontSize: '0.75rem', color: 'text.secondary' }} />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
        {t('tapToEdit')}
      </Typography>
    </Row>
    <ScrollableColumn spacing={2} flex={1} minHeight={0} sx={{ pr: 0, paddingTop: 1 }}>
      <Grid container spacing={2}>
        {categories.map(category => (
          <CategoryCard key={category._id} category={category} selectCategory={selectCategory} />
        ))}
      </Grid>
    </ScrollableColumn>
  </Grid>
  );
};

export default CategoriesTypeSection;
