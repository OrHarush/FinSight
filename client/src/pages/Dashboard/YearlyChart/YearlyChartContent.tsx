import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useTransactions } from '@/hooks/useTransactions';
import EntityEmpty from '@/components/entities/EntityEmpty';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import EntityError from '@/components/entities/EntityError';
import { useMonthLabels } from '@/hooks/useMonthsLabels';
import { useTranslation } from 'react-i18next';
import { queryKeys } from '@/constants/queryKeys';

const YearlyChartContent = () => {
  const { t } = useTranslation('common');
  const { isLoading, error, refetch } = useTransactions();
  const { year } = useDashboardFilters();
  const monthLabels = useMonthLabels();

  const { data: yearlySummary } = useFetch<TransactionSummaryDto[]>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year),
    queryKey: queryKeys.yearlyChart(year),
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
      borderRadius={4}
      series={[
        {
          data: monthlyIncome,
          label: `₪ ${t('general.income')}`,
          color: '#67ec6b',
        },
        {
          data: monthlyExpenses,
          label: `₪ ${t('general.expenses')}`,
          color: '#c31b12',
        },
      ]}
    />
  );
};

export default YearlyChartContent;
