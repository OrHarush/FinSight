import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

interface RetrospectiveOverviewHeroProps {
  net: number;
  income: number;
}

const buildSubtitleKey = (
  net: number,
  income: number
): { key: string; percent?: number } => {
  if (income <= 0) {
    return { key: 'retrospectiveOverview.noIncome' };
  }

  if (net === 0) {
    return { key: 'retrospectiveOverview.brokeEven' };
  }

  const percent = Math.round((Math.abs(net) / income) * 1000) / 10;

  return {
    key: net > 0 ? 'retrospectiveOverview.savedPercent' : 'retrospectiveOverview.overspentPercent',
    percent,
  };
};

const RetrospectiveOverviewHero = ({ net, income }: RetrospectiveOverviewHeroProps) => {
  const { t } = useTranslation('overview');
  const { key, percent } = buildSubtitleKey(net, income);

  return (
    <Column spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {t('retrospectiveOverview.title')}
      </Typography>
      <Row alignItems="baseline" spacing={0.75} flexWrap="wrap">
        <CurrencyText value={net} variant="h4" fontWeight={700} hasColor hasSign />
        <Typography variant="subtitle1" color="text.primary">
          {t('retrospectiveOverview.netSuffix')}
        </Typography>
      </Row>
      <Typography variant="body2" color="text.disabled">
        {t(key, { percent })}
      </Typography>
    </Column>
  );
};

export default RetrospectiveOverviewHero;
