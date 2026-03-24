import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TransactionDto } from '@/types/Transaction';

interface RecurrenceBadgeProps {
  transaction: TransactionDto
}

const RecurrenceBadge = ({transaction}: RecurrenceBadgeProps) => {
  const {t} = useTranslation('transactions');

  return (
      transaction.recurrence && transaction.recurrence !== 'None' && (
        <Chip
          label={t(`recurrence.${transaction.recurrence.toLowerCase()}`)}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ fontSize: '0.65rem', height: 18, flexShrink: 0 }}
        />)
  );
};

export default RecurrenceBadge;