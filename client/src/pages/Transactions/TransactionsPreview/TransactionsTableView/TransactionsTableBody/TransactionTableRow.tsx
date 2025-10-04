import { TableCell, TableRow } from '@mui/material';
import CurrencyText from '@/components/CurrencyText';
import CategoryChip from '@/pages/Transactions/TransactionsPreview/CategoryChip';
import EditAndDeleteButtons from '@/components/EditAndDeleteButtons';
import { ExtendedTransaction } from '@/types/Transaction';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';

interface TransactionTableRowProps {
  transaction: ExtendedTransaction;
}

const TransactionTableRow = ({ transaction }: TransactionTableRowProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const { setSelectedTransaction } = useSelectedTransaction();

  const deleteTransaction = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction.originalId}`,
    queryKeysToInvalidate: [queryKeys.transactions()],
    options: {
      onSuccess: () => alertSuccess('Transaction deleted'),
      onError: err => {
        alertError('Failed to delete transaction');
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  return (
    <TableRow key={transaction._id}>
      <TableCell>{transaction.type === 'Transfer' ? 'Transfer' : transaction.name}</TableCell>
      <TableCell align="left">
        <CurrencyText
          value={transaction.amount}
          color={
            transaction.type === 'Transfer'
              ? transaction.account?._id === transaction.fromAccount?._id
                ? 'error.main'
                : 'success.main'
              : transaction?.category?.type === 'Expense'
                ? 'error.main'
                : 'success.main'
          }
        />
      </TableCell>
      <TableCell align="left">
        <CategoryChip
          name={transaction?.category?.name || 'Uncategorized'}
          color={transaction?.category?.color || '#c8c8c8'}
          icon={transaction?.category?.icon}
        />
      </TableCell>
      <TableCell align="left">{transaction.account?.name}</TableCell>
      <TableCell align="left">{transaction.recurrence}</TableCell>
      <TableCell align="left">{new Date(transaction.date).toLocaleDateString('en-GB')}</TableCell>
      <TableCell align="center">
        <EditAndDeleteButtons
          onDelete={() => deleteTransaction.mutate()}
          onEdit={() => setSelectedTransaction(transaction)}
        />
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
