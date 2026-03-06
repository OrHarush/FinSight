import { Box, Typography } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import { TransactionDto } from '@/types/Transaction';

interface BudgetTransactionListProps {
  transactions: TransactionDto[];
}

const BudgetTransactionItem = ({ tx }: { tx: TransactionDto }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 1,
      backgroundColor: 'action.hover',
      '&:hover': { backgroundColor: 'action.selected' },
    }}
  >
    <Row justifyContent="space-between" alignItems="center">
      <Column spacing={0}>
        <Typography variant="body2" fontWeight={500}>
          {tx.name || 'No description'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tx.date ? new Date(tx.date).toLocaleDateString() : 'No date'}
          {tx.account && ` • ${tx.account.name}`}
        </Typography>
      </Column>
      <Typography variant="body2" fontWeight={600} color="error.main" sx={{ ml: 2 }}>
        -₪{tx.amount.toLocaleString()}
      </Typography>
    </Row>
  </Box>
);

const BudgetTransactionList = ({ transactions }: BudgetTransactionListProps) => {
  const { t } = useTranslation('budget');

  if (transactions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
        {t('transactions.noTransactions')}
      </Typography>
    );
  }

  return (
    <Column spacing={1}>
      {transactions.map(tx => (
        <BudgetTransactionItem key={tx._id} tx={tx} />
      ))}
    </Column>
  );
};

export default BudgetTransactionList;
