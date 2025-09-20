import { TableBody, TableCell, TableRow } from '@mui/material';
import TransactionTableRow from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableRow';
import { useTransactions } from '@/providers/TransactionsProvider';

const TransactionTableBody = () => {
  const { transactions } = useTransactions();

  console.log(transactions);

  return (
    <TableBody>
      {transactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={6} align="center">
            No transactions found
          </TableCell>
        </TableRow>
      ) : (
        transactions.map(tx => <TransactionTableRow key={tx._id} transaction={tx} />)
      )}
    </TableBody>
  );
};

export default TransactionTableBody;
