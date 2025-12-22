import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';

interface TopCategoriesContentProps {
  chartData: {
    id: string;
    name: string;
    amount: number;
    color: string | undefined;
  }[];
}

const TopCategoriesChart = ({ chartData }: TopCategoriesContentProps) => {
  const dataset = chartData.map(d => ({
    category: d.name,
    spent: d.amount,
  }));

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ height: '100%', minWidth: '240px', padding: 2 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" color="text.secondary">
            Top Spending Categories
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: '350px' }}>
            <BarChart
              layout="horizontal"
              dataset={dataset}
              borderRadius={8}
              series={[
                {
                  dataKey: 'spent',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              ]}
              yAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'category',
                  barGapRatio: 0.5,
                  categoryGapRatio: 0.4,
                },
              ]}
              xAxis={[
                {
                  valueFormatter: (value: number) => `₪${value.toLocaleString()}`,
                },
              ]}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TopCategoriesChart;
