import { TableBody, TableCell, TableRow } from '@mui/material';
import TransactionTableRow from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableRow';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import NoTransactions from '@/components/Placeholders/NoTransactions';

const TransactionTableBody = () => {
  const { transactions } = useTransactions();

  return (
    <TableBody>
      {transactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <NoTransactions />
          </TableCell>
        </TableRow>
      ) : (
        transactions.map(tx => <TransactionTableRow key={tx._id} transaction={tx} />)
      )}
    </TableBody>
  );
};

export default TransactionTableBody;
