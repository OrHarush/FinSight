import { Paper, Table, TableContainer, TablePagination } from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';
import { ExtendedTransaction } from '@/types/Transaction';
import { useState } from 'react';

interface TransactionsTableViewProps {
  filteredTransactions: ExtendedTransaction[];
}

const TransactionsTableView = ({ filteredTransactions }: TransactionsTableViewProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader
        aria-label="transactions table"
        sx={{
          borderCollapse: 'separate',
          borderSpacing: 0,
          '& th': {
            backgroundColor: 'background.paper',
            fontWeight: 600,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& td': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <TransactionTableHeaders />
        <TransactionTableBody
          filteredTransactions={filteredTransactions}
          page={page}
          rowsPerPage={rowsPerPage}
        />
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Table>
    </TableContainer>
  );
};

export default TransactionsTableView;
