import { Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { monthLabels } from '@/constants/monthLabels';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import Column from '@/components/Layout/Containers/Column';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';

const YearlyChart = () => {
  const { year } = useDashboardFilters();
  const { data: yearlySummary } = useFetch<TransactionSummaryDto[]>({
    url: `${API_ROUTES.TRANSACTIONS}/summary?year=${year}`,
    queryKey: ['transactionSummary', year],
    enabled: !!year,
  });

  const monthlyIncome = yearlySummary?.map(month => month.monthlyIncome) ?? [];
  const monthlyExpenses = yearlySummary?.map(month => month.monthlyExpenses) ?? [];

  console.log(yearlySummary);
  const hasData =
    yearlySummary &&
    yearlySummary.some(m => (m.monthlyIncome ?? 0) !== 0 || (m.monthlyExpenses ?? 0) !== 0);

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
            {!hasData ? (
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
