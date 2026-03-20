import { Paper, Table, TableContainer, TablePagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EntityError from '@/components/entities/EntityError';
import Column from '@/components/shared/layout/containers/Column';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import TransactionsTotals from '@/pages/Transactions/TransactionsPreview/TransactionsTotals';
import { TransactionPageFormValues } from '@/types/Transaction';

const TransactionsTableView = () => {
  const { t } = useTranslation('transactions');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { selectedMonth, selectedCategory } = useTransactionPageData();
  const { control } = useFormContext<TransactionPageFormValues>();

  const searchValue = useWatch({ control, name: 'searchValue' });

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    selectedMonth.year(),
    selectedMonth?.month(),
    searchValue,
    selectedCategory ?? undefined,
    page + 1,
    rowsPerPage
  );

  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'Income') acc.totalIncome += tx.amount;
      if (tx.type === 'Expense') acc.totalExpenses += tx.amount;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
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
    <Column height={'100%'} spacing={2}>
      <TransactionsTotals totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <Paper sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <TableContainer sx={{ flex: 1, minHeight: 0 }}>
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
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination?.total ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage={t('table.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            t('table.displayedRows', { from, to, count })
          }
        />
      </Paper>
    </Column>
  );
};

export default TransactionsTableView;
