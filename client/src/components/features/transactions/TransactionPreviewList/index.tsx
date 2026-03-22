import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TransactionPreviewItem from '@/components/features/transactions/TransactionPreviewList/TransactionPreviewItem';
import Column from '@/components/shared/layout/containers/Column';
import { TransactionDto } from '@/types/Transaction';

interface TransactionPreviewListProps {
  transactions: TransactionDto[];
  emptyMessageKey?: string;
  extraCount?: number;
}

const TransactionPreviewList = ({
  transactions,
  emptyMessageKey = 'deleteDialog.noTransactions',
  extraCount = 0,
}: TransactionPreviewListProps) => {
  const { t } = useTranslation('common');

  if (transactions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
        {t(emptyMessageKey)}
      </Typography>
    );
  }

  return (
    <Column spacing={1}>
      {transactions.map(tx => (
        <TransactionPreviewItem key={tx._id} tx={tx} />
      ))}
      {extraCount > 0 && (
        <Typography variant="caption" color="text.secondary">
          {t('deleteDialog.andMore', { count: extraCount })}
        </Typography>
      )}
    </Column>
  );
};

export default TransactionPreviewList;
