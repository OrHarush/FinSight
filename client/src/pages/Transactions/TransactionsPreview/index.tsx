import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';
import { Dayjs } from 'dayjs';
import { useTransactions } from '@/hooks/useTransactions';
import Column from '@/components/layout/Containers/Column';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import EntityEmpty from '@/components/entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EntityError from '@/components/entities/EntityError';
import TransactionsTableSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionsTableSkeleton';

interface TransactionsPreviewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsPreview = ({ selectedMonth, selectedCategory }: TransactionsPreviewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    2025,
    selectedMonth?.month(),
    selectedCategory ?? undefined
  );

  if (isLoading) {
    return (
      <Column>
        {isMobile ? (
          <>
            <TransactionsCardsSkeleton />
          </>
        ) : (
          <>
            <TransactionsTableSkeleton />
          </>
        )}
      </Column>
    );
  }

  if (!transactions.length && !isLoading) {
    return <EntityEmpty entityName={'transactions'} icon={ReceiptLongIcon} />;
  }

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  return isMobile ? (
    <TransactionsCardsView transactions={transactions} pagination={pagination} />
  ) : (
    <TransactionsTableView transactions={transactions} pagination={pagination} />
  );
};

export default TransactionsPreview;
