import { Card, Grid, Typography } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import EntityEmpty from '@/components/entities/EntityEmpty';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';

const EmptyCategoriesChart = () => {
  const { t } = useTranslation('overview');

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ height: '500px' }}>
        <Column height={'100%'} padding={4} justifyContent={'center'}>
          <Typography variant="h6" gutterBottom>
            {t('topSpendingCategories.title')}
          </Typography>
          <EntityEmpty entityName={'transactions'} icon={CategoryIcon} />
        </Column>
      </Card>
    </Grid>
  );
};

export default EmptyCategoriesChart;
