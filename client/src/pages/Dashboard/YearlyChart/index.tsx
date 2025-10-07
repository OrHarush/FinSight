import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import Column from '@/components/Layout/Containers/Column';
import YearlyChartContent from '@/pages/Dashboard/YearlyChart/YearlyChartContent';

const YearlyChart = () => {
  const { year } = useDashboardFilters();

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ width: '100%' }}>
        <CardContent
          sx={{
            padding: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Column width={'100%'} height={'360px'}>
            <Typography variant="h6">Income & Expenses ({year})</Typography>
            <YearlyChartContent />
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default YearlyChart;
