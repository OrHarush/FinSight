import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Pagination } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import { useTransactions } from '@/hooks/entities/useTransactions';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionPageFormValues } from '@/types/Transaction';
import TransactionsTotals from '@/pages/Transactions/TransactionsPreview/TransactionsTotals';

interface TransactionsCardsViewProps {
  selectedCategory: string;
  selectedMonth: Dayjs;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const [page, setPage] = useState(1);
  const { control } = useFormContext<TransactionPageFormValues>();

  const searchValue = useWatch({ control, name: 'searchValue' });

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    dayjs().year(),
    selectedMonth.month(),
    searchValue,
    selectedCategory,
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
  }, [selectedMonth, selectedCategory]);

  if (isLoading) {
    return <TransactionsCardsSkeleton />;
  }

  if (error) {
    return <EntityError entityName="transactions" refetch={refetch} />;
  }

  if (!transactions.length) {
    return <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />;
  }

  return (
    <Box display="flex" flexDirection="column">
      <TransactionsTotals totalIncome={totalIncome} totalExpenses={totalExpenses} />
      {transactions.map(tx => (
        <TransactionCard key={tx._id} transaction={tx} />
      ))}
      {pagination?.total && (
        <Box display="flex" justifyContent="center" py={2}>
          <Pagination
            count={Math.ceil(pagination.total / 20)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default TransactionsCardsView;
