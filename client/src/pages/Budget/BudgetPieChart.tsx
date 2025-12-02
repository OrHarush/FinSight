import { PieChart } from '@mui/x-charts';
import { Box } from '@mui/material';
import { useMemo } from 'react';

const BudgetPieChart = ({ categories, perCategorySpent }) => {
  const data = useMemo(() => {
    if (!categories) return [];

    return categories
      .filter(c => perCategorySpent.has(c._id))
      .map(c => ({
        id: c._id,
        value: perCategorySpent.get(c._id) ?? 0,
        label: c.name,
        color: c.color,
      }));
  }, [categories, perCategorySpent]);

  if (!data.length) return null;

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 240, sm: 280 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PieChart
        height={300}
        series={[
          {
            data,
          },
        ]}
        hideLegend
      />
    </Box>
  );
};

export default BudgetPieChart;
