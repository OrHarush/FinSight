import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useTransactions } from '@/hooks/useTransactions';
import EntityEmpty from '@/components/entities/EntityEmpty';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { monthLabels } from '@/constants/monthLabels';
import EntityError from '@/components/entities/EntityError';

const YearlyChartContent = () => {
  const { isLoading, error, refetch } = useTransactions();
  const { year } = useDashboardFilters();

  const { data: yearlySummary } = useFetch<TransactionSummaryDto[]>({
    url: `${API_ROUTES.TRANSACTIONS}/summary?year=${year}`,
    queryKey: ['transactionSummary', year],
    enabled: !!year,
  });

  const monthlyIncome = yearlySummary?.map(month => month.monthlyIncome) ?? [];
  const monthlyExpenses = yearlySummary?.map(month => month.monthlyExpenses) ?? [];

  const hasData =
    yearlySummary &&
    yearlySummary.some(m => (m.monthlyIncome ?? 0) !== 0 || (m.monthlyExpenses ?? 0) !== 0);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={'100%'} sx={{ borderRadius: 2 }} />;
  }

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  if (!hasData) {
    return <EntityEmpty entityName={'transactions'} subtitleKey={'chart'} icon={BarChartIcon} />;
  }
  return (
    <BarChart
      xAxis={[{ data: monthLabels, scaleType: 'band' }]}
      series={[
        { data: monthlyIncome, label: '₪ Income', color: '#67ec6b' },
        { data: monthlyExpenses, label: '₪ Expenses', color: '#c31b12' },
      ]}
      height={300}
    />
  );
};

export default YearlyChartContent;
