import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

interface ProjectedBalanceBreakdownProps {
  balance: number;
  futureIncome: number;
  futureExpenses: number;
  pendingPriorExpenses?: number;
  projected: number;
}

const ProjectedBalanceBreakdown = ({
  balance,
  futureIncome,
  futureExpenses,
  pendingPriorExpenses,
  projected,
}: ProjectedBalanceBreakdownProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={0.5} sx={{ minWidth: 240 }}>
      <Row justifyContent="space-between" alignItems="center" spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {t('projectedBreakdown.currentBalance')}
        </Typography>
        <CurrencyText value={balance} variant="body2" />
      </Row>

      {futureIncome !== 0 && (
        <Row justifyContent="space-between" alignItems="center" spacing={3}>
          <Typography variant="body2" color="text.secondary">
            {t('projectedBreakdown.expectedIncome')}
          </Typography>
          <CurrencyText value={futureIncome} variant="body2" hasSign hasColor />
        </Row>
      )}

      {futureExpenses !== 0 && (
        <Row justifyContent="space-between" alignItems="center" spacing={3}>
          <Typography variant="body2" color="text.secondary">
            {t('projectedBreakdown.expectedExpenses')}
          </Typography>
          <CurrencyText value={-futureExpenses} variant="body2" hasColor />
        </Row>
      )}

      {!!pendingPriorExpenses && (
        <Row justifyContent="space-between" alignItems="center" spacing={3}>
          <Typography variant="body2" color="text.secondary">
            {t('projectedBreakdown.pendingPrior')}
          </Typography>
          <CurrencyText value={-pendingPriorExpenses} variant="body2" hasColor />
        </Row>
      )}

      <Divider sx={{ my: 1 }} />

      <Row justifyContent="space-between" alignItems="center" spacing={3}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {t('projectedBreakdown.projected')}
        </Typography>
        <CurrencyText value={projected} variant="body2" fontWeight={500} />
      </Row>
    </Column>
  );
};

export default ProjectedBalanceBreakdown;
