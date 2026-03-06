import { Grid } from '@mui/material';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useFetch } from '@/hooks/common/useFetch';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFinancialHealthIndicators } from '@/hooks/business/useFinancialHealthIndicators';
import { resolveOverallSeverity, hasNoData, HealthIndicator } from '@/utils/healthIndicatorUtils';
import OverallHealthIcon from './OverallHealthIcon';
import HealthIndicatorCell from './HealthIndicatorCell';
import MonthlyFinancialHealthSkeleton from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthSkeleton';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';

const MonthlyFinancialHealth = () => {
  const { year, month, account } = useOverviewFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions(year, month);

  const { data, isLoading: isLoadingSummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const isLoading = isLoadingSummary || isLoadingAccounts || isLoadingTransactions;

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;
  const hasMonthData = transactions.filter(tx => tx.account?._id === account?._id).length > 0;

  const indicators = useFinancialHealthIndicators({
    income,
    expenses,
    hasMonthData,
  });

  if (isLoading) {
    return <MonthlyFinancialHealthSkeleton />;
  }

  const overallStatus = resolveOverallSeverity(indicators);
  const isNoDataState = hasNoData(indicators);

  return (
    <MonthlyFinancialHealthCard>
      <Grid container height={'100%'} spacing={2} alignItems={'center'}>
        <Grid size={{ xs: 12, sm: 3, md: 12, lg: 3 }} justifyItems={'center'}>
          <OverallHealthIcon status={overallStatus} />
        </Grid>
        <Grid container size={{ xs: 12, sm: 9, md: 12, lg: 9 }} justifyItems={'center'}>
          <HealthIndicatorsGrid indicators={indicators} isNoDataState={isNoDataState} />
        </Grid>
      </Grid>
    </MonthlyFinancialHealthCard>
  );
};

interface HealthIndicatorsGridProps {
  indicators: HealthIndicator[];
  isNoDataState: boolean;
}

const HealthIndicatorsGrid = ({ indicators, isNoDataState }: HealthIndicatorsGridProps) => (
  <>
    {indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: isNoDataState ? 12 : 4 }} textAlign={'center'}>
        <HealthIndicatorCell
          title={indicator.title}
          value={indicator.value}
          description={indicator.description}
        />
      </Grid>
    ))}
  </>
);

export default MonthlyFinancialHealth;
