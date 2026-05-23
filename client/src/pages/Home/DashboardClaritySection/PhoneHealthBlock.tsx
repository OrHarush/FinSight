import { Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FullVariant from '@/components/features/overview/FullVariant';
import { HealthTile } from '@/hooks/business/useFinancialHealthIndicators';

const DAILY_SPEND = 240;

const PhoneHealthBlock = () => {
  const { t } = useTranslation('overview');

  const runwayTile: HealthTile = {
    label: t('budgetRunwayCard.title'),
    value: t('budgetRunwayCard.enoughForMonth'),
    description: t('budgetRunwayCard.enoughForMonthDesc'),
  };

  const dailySpendTile: HealthTile = {
    label: t('dailySpendCard.title'),
    value: t('dailySpendCard.valuePerDay', { amount: DAILY_SPEND }),
    description: t('dailySpendCard.toUseRemainingBudget'),
  };

  return (
    <Card sx={{ p: 2 }}>
      <FullVariant insightKey="excellent" tiles={[runwayTile, dailySpendTile]} />
    </Card>
  );
};

export default PhoneHealthBlock;
