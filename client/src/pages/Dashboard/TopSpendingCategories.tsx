import { useMemo } from 'react';
import { Card, Typography, Box, Skeleton, Grid, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts';

import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { getTopSpendingCategories } from '@/utils/categoryUtils';

const MAX_ITEMS = 5;

const TopSpendingCategories = () => {
  const { year, month } = useDashboardFilters();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(year, month);

  const chartData = useMemo(() => {
    if (!categories || !transactions) {
      return [];
    }

    return getTopSpendingCategories(transactions, categories, MAX_ITEMS);
  }, [categories, transactions]);

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 2, p: 2 }}>
        <Skeleton variant="rectangular" height={220} />
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 2, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Top Spending Categories — This Month
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No expense data available for this month.
        </Typography>
      </Card>
    );
  }
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

export default TopSpendingCategories;
