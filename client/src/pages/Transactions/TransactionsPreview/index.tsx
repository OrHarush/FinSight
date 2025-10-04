import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import EntityError from '@/components/Entities/EntityError';
import { Dayjs } from 'dayjs';
import { useTransactions } from '@/hooks/useTransactions';

interface TransactionsPreviewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsPreview = ({ selectedMonth, selectedCategory }: TransactionsPreviewProps) => {
  const { transactions, pagination, refetch, isLoading, error } = useTransactions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) {
    return isMobile ? <TransactionsCardsSkeleton /> : <TransactionsTableSkeleton />;
  }

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  return isMobile ? (
    <TransactionsCardsView filteredTransactions={transactions} />
  ) : (
    <TransactionsTableView filteredTransactions={transactions} />
  );
};

export default TransactionsPreview;
