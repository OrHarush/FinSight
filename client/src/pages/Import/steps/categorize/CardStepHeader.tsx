import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { UNKNOWN_CARD_KEY } from '@/pages/Import/types/importWizard';

interface CardStepHeaderProps {
  cardKey: string;
  currentIndex: number;
  totalCards: number;
  rowCount: number;
}

const CardStepHeader = ({ cardKey, currentIndex, totalCards, rowCount }: CardStepHeaderProps) => {
  const { t } = useTranslation('transactions');

  const cardLabel =
    cardKey === UNKNOWN_CARD_KEY
      ? t('importWizard.categorize.cardUnassigned')
      : t('importWizard.categorize.cardLabel', { last4: cardKey });

  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.25, borderRadius: 1.5 }}>
      <Row justifyContent="space-between" alignItems="center" spacing={2}>
        <Column spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {t('importWizard.categorize.cardProgress', {
              current: currentIndex + 1,
              total: totalCards,
            })}
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {cardLabel}
          </Typography>
        </Column>
        <Typography variant="body2" color="text.secondary">
          {t('importWizard.categorize.cardRowCount', { count: rowCount })}
        </Typography>
      </Row>
    </Paper>
  );
};

export default CardStepHeader;
