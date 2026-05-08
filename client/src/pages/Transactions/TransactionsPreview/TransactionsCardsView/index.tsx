import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import { useTransactions } from '@/hooks/entities/useTransactions';
import TransactionsTotals from '@/pages/Transactions/components/TransactionsTotals';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import GhostContributionsBanner from '@/pages/Transactions/TransactionsPreview/GhostContributionsBanner';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import { TransactionPageFormValues } from '@/types/Transaction';

const TransactionsCardsView = () => {
  const [page, setPage] = useState(1);
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
    page,
    20
  );

  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'Income') acc.totalIncome += tx.amount;
      if (tx.type === 'Expense') acc.totalExpenses += tx.amount;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedCategoryIds, selectedAccountIds, selectedPaymentMethodIds]);

  if (isLoading) {
    return <TransactionsCardsSkeleton />;
  }

  if (error) {
    return <EntityError entityName="transactions" refetch={refetch} />;
  }

  if (!transactions.length) {
    return (
      <Column spacing={1} overflow="hidden">
        <GhostContributionsBanner month={selectedMonth} />
        <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />
      </Column>
    );
  }

  return (
    <Column spacing={1} overflow={'hidden'}>
      <TransactionsTotals totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <ScrollableColumn flex={1} sx={{ pr: 0.5 }}>
        <GhostContributionsBanner month={selectedMonth} />
        {transactions.map(tx => (
          <TransactionCard key={tx._id} transaction={tx} />
        ))}
      </ScrollableColumn>
      {pagination?.total && (
        <Box display="flex" justifyContent="center" py={2} sx={{ flexShrink: 0 }}>
          <Pagination
            count={Math.ceil(pagination.total / 20)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Column>
  );
};

export default TransactionsCardsView;
