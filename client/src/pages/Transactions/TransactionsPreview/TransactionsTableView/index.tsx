import { Paper, Table, TableContainer } from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';

const TransactionsTableView = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="transactions table">
        <TransactionTableHeaders />
        <TransactionTableBody />
      </Table>
    </TableContainer>
  );
};

export default TransactionsTableView;
