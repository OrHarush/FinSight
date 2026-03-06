import { PieChart } from '@mui/x-charts';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { CategoryDto } from '@/types/Category';

interface BudgetPieChartProps {
  categories?: CategoryDto[];
  perCategorySpent: Map<string, number>;
  onCategoryClick?: (category: CategoryDto) => void;
}

const BudgetPieChart = ({ categories, perCategorySpent, onCategoryClick }: BudgetPieChartProps) => {
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
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <PieChart
        height={500}
        series={[
          {
            data,
            outerRadius: 100,
          },
        ]}
      />
    </Box>
  );
};

export default BudgetPieChart;
