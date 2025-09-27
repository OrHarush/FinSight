import { Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import { monthLabels } from '@/constants/monthLabels';
import { useDashboardDate } from '@/pages/Dashboard/DashboardDateProvider';
import Column from '@/components/Layout/Containers/Column';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import BarChartIcon from '@mui/icons-material/BarChart';

const YearlyChart = () => {
  const { transactions } = useTransactions();
  const { selectedYear } = useDashboardDate();

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

  // const timeline = calculateBalanceTimeline(transactions, 0);

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
            <Typography variant="h6">Income & Expenses ({selectedYear})</Typography>
            {!transactions || !transactions.length ? (
              <EntityEmpty
                entityName={'transactions'}
                subtitle={'Add some to see your income & expenses graph'}
                icon={BarChartIcon}
              />
            ) : (
              // <LineChart
              //   xAxis={[
              //     {
              //       data: timeline.map(p => p.date),
              //       scaleType: 'time',
              //     },
              //   ]}
              //   series={[
              //     {
              //       data: timeline.map(p => p.balance),
              //       label: 'Balance',
              //     },
              //   ]}
              //   width={600}
              //   height={400}
              // />
              <BarChart
                xAxis={[{ data: monthLabels, scaleType: 'band' }]}
                series={[
                  { data: monthlyIncome, label: '₪ Income', color: '#67ec6b' },
                  { data: monthlyExpenses, label: '₪ Expenses', color: '#c31b12' },
                ]}
                height={300}
              />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default YearlyChart;
