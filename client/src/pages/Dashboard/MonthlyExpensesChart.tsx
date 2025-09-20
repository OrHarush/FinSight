import { Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTransactions } from '@/providers/TransactionsProvider';
import { monthLabels } from '@/constants/monthLabels';
import { useDashboardDate } from '@/pages/Dashboard/DashboardDateProvider';

const MonthlyExpensesChart = () => {
  const { transactions } = useTransactions();
  const { selectedYear } = useDashboardDate();

  if (!transactions || !transactions.length) {
    return null;
  }

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpenses = Array(12).fill(0);

  transactions.forEach(tx => {
    const date = new Date(tx.date);
    if (date.getFullYear() !== selectedYear) return;

    const monthIndex = date.getMonth();
    if (tx.category?.type.toLowerCase() === 'income') {
      monthlyIncome[monthIndex] += tx.amount;
    } else if (tx.category?.type.toLowerCase() === 'expense') {
      monthlyExpenses[monthIndex] += tx.amount;
    }
  });

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
          <Typography variant="h6">Income & Expenses ({selectedYear})</Typography>
        </CardContent>
        <BarChart
          xAxis={[{ data: monthLabels, scaleType: 'band' }]}
          series={[
            { data: monthlyIncome, label: '₪ Income', color: '#67ec6b' },
            { data: monthlyExpenses, label: '₪ Expenses', color: '#c31b12' },
          ]}
          height={300}
        />
      </Card>
    </Grid>
  );
};

export default MonthlyExpensesChart;
