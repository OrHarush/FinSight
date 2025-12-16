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

  const categoryColors: string[] = chartData.map(d => d.color ?? '#171717');

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '620px', minWidth: '240px' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Top Spending Categories
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 500 }}>
            <BarChart
              layout="horizontal"
              dataset={dataset}
              borderRadius={8}
              series={[
                {
                  dataKey: 'spent',
                },
              ]}
              yAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'category',
                  colorMap: {
                    type: 'ordinal',
                    colors: categoryColors,
                  },
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
