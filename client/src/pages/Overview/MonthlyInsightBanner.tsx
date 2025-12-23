import { Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import Row from '@/components/layout/Containers/Row';
import { useIsMobile } from '@/hooks/useIsMobile';

type InsightKey = 'excellent' | 'good' | 'balanced' | 'overspent';

const getInsightKey = (netRatio: number): InsightKey => {
  if (netRatio >= 0.2) return 'excellent';
  if (netRatio >= 0.1) return 'good';
  if (netRatio >= 0) return 'balanced';
  return 'overspent';
};

const colorMap: Record<InsightKey, 'success.main' | 'warning.main' | 'error.main'> = {
  excellent: 'success.main',
  good: 'success.main',
  balanced: 'warning.main',
  overspent: 'error.main',
};

const MonthlyInsightBanner = () => {
  const { year, month, account } = useOverviewFilters();
  const isMobile = useIsMobile();
  const { t } = useTranslation('overview');

  const { data, isLoading } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  if (isLoading) {
    return (
      <Row width="100%" alignItems="center">
        <Skeleton variant="text" width={90} height={28} />
        <Typography sx={{ fontWeight: 600, mx: 1 }}>·</Typography>
        <Skeleton variant="text" width={200} height={28} />
      </Row>
    );
  }

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;

  if (!income) {
    return null;
  }

  const netRatio = (income - expenses) / income;
  const insightKey = getInsightKey(netRatio);

  return (
    <Row justifyContent={isMobile ? 'center' : 'flex-start'}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colorMap[insightKey] }}>
        {t(`monthlyInsight.${insightKey}.title`)} · {t(`monthlyInsight.${insightKey}.message`)}
      </Typography>
    </Row>
  );
};

export default MonthlyInsightBanner;
