import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { InsightKey } from '@/utils/financialHealth';

interface MonthlyInsightProps {
  insightKey: InsightKey;
}

const colorMap: Record<InsightKey, string> = {
  excellent: 'success.main',
  good: 'success.main',
  balanced: 'info.main',
  atRisk: 'warning.main',
  overspent: 'error.main',
};

const MonthlyInsight = ({ insightKey }: MonthlyInsightProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column>
      <Typography variant="h5" sx={{ color: colorMap[insightKey] }}>
        {t(`monthlyInsight.${insightKey}.title`)}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {t(`monthlyInsight.${insightKey}.message`)}
      </Typography>
    </Column>
  );
};

export default MonthlyInsight;
