import { Box } from '@mui/material';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import EntityEmpty from '@/components/entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Dayjs } from 'dayjs';
import { useTransactions } from '@/hooks/useTransactions';
import EntityError from '@/components/entities/EntityError';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import Column from '@/components/layout/Containers/Column';

interface TransactionsCardsViewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const { transactions, isLoading, error, refetch } = useTransactions(
    2025,
    selectedMonth?.month(),
    selectedCategory ?? undefined
  );

  if (isLoading) {
    return (
      <Column>
        <TransactionsCardsSkeleton />
        <TransactionsCardsSkeleton />
        <TransactionsCardsSkeleton />
        <TransactionsCardsSkeleton />
        <TransactionsCardsSkeleton />
      </Column>
    );
  }

  if (!transactions.length && !isLoading) {
    return <EntityEmpty entityName={'transactions'} icon={ReceiptLongIcon} />;
  }

  if (error) {
    console.log('error?');
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  return (
    <Box display="flex" flexDirection="column">
      {transactions.map(transaction => (
        <TransactionCard key={transaction._id} transaction={transaction} />
      ))}
    </Box>
  );
};

export default TransactionsCardsView;
