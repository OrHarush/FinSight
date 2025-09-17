import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useOpen } from '@/hooks/useOpen';
import Column from '@/components/Layout/Column';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import Paper from '@mui/material/Paper';
import CreateTransactionDialog from '@/components/Dialogs/CreateTransactionDialog';
import { useTransactions } from '@/providers/TransactionsProvider';

export const Transactions = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
  const { transactions, isLoading, error } = useTransactions();

  return (
    <Column height="100%" width="1200px" spacing={4} alignSelf="center">
      <TransactionsHeader openCreateTransaction={openDialog} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Loading…</TableCell>
              </TableRow>
            )}
            {!!error && (
              <TableRow>
                <TableCell colSpan={4}>Error loading data</TableCell>
              </TableRow>
            )}
            {transactions?.map(transaction => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{transaction.category.name}</TableCell>
                <TableCell align="right">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateTransactionDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
    </Column>
  );
};
