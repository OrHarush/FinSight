import { Paper, Table, TableContainer, TablePagination } from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Dayjs } from 'dayjs';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';
import EntityError from '@/components/entities/EntityError';

interface TransactionsTableViewProps {
  searchValue: string;
  selectedCategory: string;
  selectedMonth: Dayjs;
}

const TransactionsTableView = ({
  selectedMonth,
  selectedCategory,
  searchValue,
}: TransactionsTableViewProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    2025,
    selectedMonth?.month(),
    searchValue,
    selectedCategory ?? undefined,
    page + 1,
    rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [selectedMonth, selectedCategory, searchValue]);

  if (isLoading) {
    return <TransactionsTableSkeleton />;
  }

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

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
