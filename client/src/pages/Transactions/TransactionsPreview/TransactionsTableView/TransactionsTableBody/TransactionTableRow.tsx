import { TableCell, TableRow } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import CategoryChip from '@/pages/Transactions/TransactionsPreview/CategoryChip';
import EditAndDeleteButtons from '@/components/appCommon/EditAndDeleteButtons';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import { getTransactionDisplayDate } from '@/utils/transactionUtils';

interface TransactionTableRowProps {
  transaction: ExpandedTransactionDto;
}

const TransactionTableRow = ({ transaction }: TransactionTableRowProps) => {
  const { setSelectedTransaction, setTransactionAction } = useSelectedTransaction();

  return (
    <TableRow
      key={transaction._id}
      onClick={() => setSelectedTransaction(transaction)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <TableCell>{transaction.type === 'Transfer' ? 'Transfer' : transaction.name}</TableCell>
      <TableCell align="left">
        <CurrencyText
          value={transaction.amount}
          color={
            transaction.type === 'Transfer'
              ? transaction.account?._id === transaction.fromAccount?._id
                ? 'error.main'
                : 'success.main'
              : transaction?.type === 'Expense'
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
      <TableCell align="left">
        {new Date(getTransactionDisplayDate(transaction)).toLocaleDateString('en-GB')}
      </TableCell>
      <TableCell align="center">
        <EditAndDeleteButtons
          onDelete={() => {
            setTransactionAction('delete');
            setSelectedTransaction(transaction);
          }}
          onEdit={() => {
            setTransactionAction('edit');
            setSelectedTransaction(transaction);
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
