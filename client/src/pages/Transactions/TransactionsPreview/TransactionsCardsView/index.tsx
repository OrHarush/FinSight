import { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import { Dayjs } from 'dayjs';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Column from '@/components/layout/Containers/Column';

interface TransactionsCardsViewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const [page, setPage] = useState(1);

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    2025,
    selectedMonth?.month(),
    selectedCategory ?? undefined,
    page
  );

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // nice UX
  };

  if (isLoading) {
    return (
      <Column>
        <TransactionsCardsSkeleton />;
      </Column>
    );
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
