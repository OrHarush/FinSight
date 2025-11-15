import { PieChart } from '@mui/x-charts';
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
    <PieChart
      series={[
        {
          data,
          outerRadius: 100,
        },
      ]}
      height={260}
    />
  );
};

export default BudgetPieChart;
