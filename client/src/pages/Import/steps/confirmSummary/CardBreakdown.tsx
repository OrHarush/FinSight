import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { UNKNOWN_CARD_KEY, WizardRow } from '@/pages/Import/types/importWizard';

interface CardBreakdownProps {
  cardKey: string;
  rowsForCard: WizardRow[];
  paymentMethodName: string | null;
}

const CardBreakdown = ({ cardKey, rowsForCard, paymentMethodName }: CardBreakdownProps) => {
  const { t } = useTranslation('transactions');

  const categorizedCount = rowsForCard.filter(r => r.categoryId !== null).length;
  const uncategorizedCount = rowsForCard.length - categorizedCount;
  const cardLabel =
    cardKey === UNKNOWN_CARD_KEY
      ? t('importWizard.categorize.cardUnassigned')
      : t('importWizard.categorize.cardLabel', { last4: cardKey });

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
      <Column spacing={1}>
        <Row justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>{cardLabel}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.categorize.cardRowCount', { count: rowsForCard.length })}
          </Typography>
        </Row>
        {paymentMethodName && (
          <Row justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.settings.paymentMethod')}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {paymentMethodName}
            </Typography>
          </Row>
        )}
        <Row justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.confirm.categorized')}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {categorizedCount}
          </Typography>
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Row spacing={0.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('importWizard.confirm.uncategorized')}
            </Typography>
            {uncategorizedCount > 0 && (
              <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            )}
          </Row>
          <Typography variant="body2" fontWeight={500}>
            {uncategorizedCount}
          </Typography>
        </Row>
      </Column>
    </Paper>
  );
};

export default CardBreakdown;
