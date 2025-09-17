import { Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTransactions } from '@/providers/TransactionsProvider';

const MonthlyExpensesChart = () => {
  const { transactions } = useTransactions();
  if (!transactions || !transactions.length) {
    return null;
  }

  // Step 1: Reduce transactions into { '2025-01': sum, '2025-02': sum, ... }
  const monthlyTotals = transactions.reduce<Record<string, number>>((acc, tx) => {
    const date = new Date(tx.date); // make sure tx.date is ISO or Date string
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    acc[monthKey] = (acc[monthKey] || 0) + tx.amount;
    return acc;
  }, {});

  // Step 2: Convert to arrays for chart
  const months = Object.keys(monthlyTotals).sort();
  const expenses = months.map(m => monthlyTotals[m]);

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ padding: 4 }}>Monthly Expenses</CardContent>
      <BarChart
        xAxis={[{ data: months, scaleType: 'band' }]}
        series={[{ data: expenses, label: '₪ Expenses' }]}
        height={300}
      />
    </Card>
  );
};

export default MonthlyExpensesChart;
