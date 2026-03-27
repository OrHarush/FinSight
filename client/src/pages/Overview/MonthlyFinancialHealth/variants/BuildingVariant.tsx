import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
const TOTAL_PIPS = 7;

interface BuildingVariantProps {
  uniqueSpendingDays: number;
  daysUntilReady: number;
}

const BuildingVariant = ({ uniqueSpendingDays, daysUntilReady }: BuildingVariantProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={4} height="100%">
      <Column spacing={1}>
        <Column spacing={0.25}>
          <Typography variant="h5" color="text.secondary">
            {t('buildingPattern.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.disabled">
            {t('buildingPattern.value')}
          </Typography>
        </Column>
        <Divider />
      </Column>
      <Column height={'100%'} spacing={1.5} justifyContent={'center'}>
        <Row spacing={1} width={'100%'}>
          {Array.from({ length: TOTAL_PIPS }, (_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 1,
                bgcolor: i < uniqueSpendingDays ? 'primary.main' : 'action.selected',
              }}
            />
          ))}
        </Row>
        <Typography variant="body2" color="text.secondary">
          {t('buildingPattern.description', { count: daysUntilReady })}
        </Typography>
      </Column>
    </Column>
  );
};

export default BuildingVariant;
