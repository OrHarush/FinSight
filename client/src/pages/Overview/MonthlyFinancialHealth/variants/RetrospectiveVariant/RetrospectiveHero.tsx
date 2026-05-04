import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

interface RetrospectiveHeroProps {
  dailyAverage: number;
  daysInMonth: number;
}

const RetrospectiveHero = ({ dailyAverage, daysInMonth }: RetrospectiveHeroProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {t('retrospectiveCard.title')}
      </Typography>
      <Row alignItems="baseline" spacing={0.75} flexWrap="wrap">
        <CurrencyText value={Math.round(dailyAverage)} variant="h4" fontWeight={700} />
        <Typography variant="subtitle1" color="text.primary">
          {t('retrospectiveCard.perDayOnAverage')}
        </Typography>
      </Row>
      <Typography variant="body2" color="text.disabled">
        {t('retrospectiveCard.dailyAverageDescription', { count: daysInMonth })}
      </Typography>
    </Column>
  );
};

export default RetrospectiveHero;
