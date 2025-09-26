import Paper from '@mui/material/Paper';
import { ExtendedTransaction } from '@/types/Transaction';
import { Box, Typography } from '@mui/material';
import EditAndDeleteButtons from '@/components/EditAndDeleteButtons';
import CurrencyText from '@/components/CurrencyText';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface TransactionCardViewProps {
  transaction: ExtendedTransaction;
}

const TransactionCard = ({ transaction }: TransactionCardViewProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const { setSelectedTransaction } = useSelectedTransaction();

  const deleteTransaction = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
    options: {
      onSuccess: () => {
        alertSuccess('Transaction deleted');
      },
      onError: err => {
        alertError('Failed to delete transaction');
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  return (
    <Paper
      key={transaction._id}
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={700}>
          {transaction.name}
        </Typography>
        <EditAndDeleteButtons
          onDelete={() => deleteTransaction.mutate()}
          onEdit={() => setSelectedTransaction(transaction)}
        />
      </Box>
      <CurrencyText
        variant="h6"
        color={transaction?.category?.type == 'Expense' ? 'error.main' : 'success.main'}
        value={transaction.amount}
      />
      <Typography variant="body2" color="text.secondary">
        Category: {transaction?.category?.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {new Date(transaction.date).toLocaleDateString()}
      </Typography>
    </Paper>
  );
};

export default TransactionCard;
