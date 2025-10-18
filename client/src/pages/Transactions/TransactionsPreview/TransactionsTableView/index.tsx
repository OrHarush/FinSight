import { Paper, Table, TableContainer, TablePagination } from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';
import { ChangeEvent, useState } from 'react';
import { TransactionDto } from '@/types/Transaction';
import { PaginationMeta } from '@/hooks/useFetch';

interface TransactionsTableViewProps {
  transactions: TransactionDto[];
  pagination?: PaginationMeta;
}

const TransactionsTableView = ({ transactions, pagination }: TransactionsTableViewProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
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
        <TransactionTableBody transactions={transactions} />
      </Table>
      <TablePagination
        component="div"
        count={pagination?.total ?? 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </TableContainer>
  );
};

export default TransactionsTableView;
