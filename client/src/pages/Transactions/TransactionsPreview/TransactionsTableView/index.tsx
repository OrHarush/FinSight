import { Paper, Table, TableContainer, TablePagination } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EntityError from '@/components/entities/EntityError';
import Column from '@/components/shared/layout/containers/Column';
import { useTransactions } from '@/hooks/entities/useTransactions';
import TransactionsTotals from '@/pages/Transactions/components/TransactionsTotals';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import GhostContributionsBanner from '@/pages/Transactions/TransactionsPreview/GhostContributionsBanner';
import TransactionTableBody from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableBody/TransactionTableBody';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import { SortableColumn, SortOrder, TransactionPageFormValues } from '@/types/Transaction';
import { compareTransactions } from '@/utils/entities/transaction';

const TransactionsTableView = () => {
  const { t } = useTranslation('transactions');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [order, setOrder] = useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = useState<SortableColumn>('date');
  const { selectedMonth, selectedCategoryIds, selectedAccountIds, selectedPaymentMethodIds } =
    useTransactionPageData();
  const { control } = useFormContext<TransactionPageFormValues>();

  const searchValue = useWatch({ control, name: 'searchValue' });

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    selectedMonth.year(),
    selectedMonth.month(),
    searchValue,
    selectedCategoryIds,
    selectedAccountIds,
    selectedPaymentMethodIds,
    page + 1,
    rowsPerPage
  );

  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'Income') {
        acc.totalIncome += tx.amount;
      }
      if (tx.type === 'Expense') {
        acc.totalExpenses += tx.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => compareTransactions(a, b, order, orderBy)),
    [transactions, order, orderBy]
  );

  const handleSort = (column: SortableColumn) => {
    setOrder(prev => (orderBy === column && prev === 'asc' ? 'desc' : 'asc'));
    setOrderBy(column);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [
    selectedMonth,
    selectedCategoryIds,
    selectedAccountIds,
    selectedPaymentMethodIds,
    searchValue,
  ]);

  if (isLoading) {
    return <TransactionsTableSkeleton />;
  }

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  return (
    <Column spacing={2} flex={1} minHeight={0}>
      <TransactionsTotals totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <GhostContributionsBanner month={selectedMonth} />
      <Paper
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
      >
        <TableContainer sx={{ flex: 1, minHeight: 0 }}>
          <Table
            stickyHeader
            aria-label="transactions table"
            sx={{
              height: sortedTransactions.length === 0 ? '100%' : 'auto',
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
            <TransactionTableHeaders order={order} orderBy={orderBy} onSort={handleSort} />
            <TransactionTableBody transactions={sortedTransactions} />
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
