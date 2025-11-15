import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Pagination } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface TransactionsCardsViewProps {
  searchValue: string;
  selectedCategory: string;
  selectedMonth: Dayjs;
}

const TransactionsCardsView = ({
  searchValue,
  selectedMonth,
  selectedCategory,
}: TransactionsCardsViewProps) => {
  const [page, setPage] = useState(1);

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    dayjs().year(),
    selectedMonth.month(),
    searchValue,
    selectedCategory,
    page,
    20
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
