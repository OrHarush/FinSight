import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Card, Grid } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import IncomeUsageMeter from '@/pages/Overview/MonthlyFinancialOverview/IncomeUsageMeter';
import OverviewMetric from '@/pages/Overview/MonthlyFinancialOverview/OverviewMetric';
import BalanceHeadline from '@/pages/Overview/MonthlyFinancialOverview/BalanceHeadline';
import MonthlyFinancialOverviewSkeleton from '@/pages/Overview/MonthlyFinancialOverview/MonthlyFinancialOverviewSkeleton';

const formatAmount = (value: number) => `₪${Math.abs(value).toLocaleString()}`;

const MonthlyFinancialOverview = () => {
  const { t } = useTranslation('common');
  const { year, month, account } = useOverviewFilters();

  const { data, isLoading } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  if (isLoading) {
    return <MonthlyFinancialOverviewSkeleton />;
  }

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;
  const net = income - expenses;

  console.log(income, net);

  if (!account) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, md: 6, lg: 5 }}>
      <Card sx={{ p: 3, height: '100%' }}>
        <Row justifyContent={'space-between'} alignItems={'center'} height={'100%'}>
          <Column spacing={2}>
            <BalanceHeadline balance={account?.balance} label={t('general.balance')} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                <OverviewMetric
                  icon={TrendingUpIcon}
                  value={formatAmount(income)}
                  label={t('general.income')}
                  color="success"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                <OverviewMetric
                  icon={TrendingDownIcon}
                  value={formatAmount(expenses)}
                  label={t('general.expenses')}
                  color="error"
                />
              </Grid>
            </Grid>
          </Column>
          <IncomeUsageMeter income={income} expenses={expenses} net={net} />
        </Row>
      </Card>
    </Grid>
  );
};

export default MonthlyFinancialOverview;
