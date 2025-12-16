import { Card, Grid, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import EntityEmpty from '@/components/entities/EntityEmpty';
import CategoryIcon from '@mui/icons-material/Category';

const EmptyCategoriesChart = () => (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '620px' }}>
        <Column padding={4} spacing={12} justifyContent={'center'}>
          <Typography variant="h6" gutterBottom>
            Top Spending Categories
          </Typography>
          <EntityEmpty entityName={'transactions'} icon={CategoryIcon} />
        </Column>
      </Card>
    </Grid>
  );

export default EmptyCategoriesChart;