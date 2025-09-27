import { useMediaQuery, useTheme } from '@mui/material';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import EntityError from '@/components/Entities/EntityError';
import { Dayjs } from 'dayjs';

interface TransactionsPreviewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsPreview = ({ selectedMonth, selectedCategory }: TransactionsPreviewProps) => {
  const { transactions, refetch, isLoading, error } = useTransactions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(transactions);

  // const filteredTransactions = useMemo(
  //   () =>
  //     filterTransactions(
  //       transactions,
  //       selectedMonth?.month(),
  //       selectedMonth?.year(),
  //       selectedCategory || undefined
  //     ),
  //   [transactions, selectedMonth, selectedCategory]
  // );

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
