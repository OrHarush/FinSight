import RecentTransactionList from '@/pages/Dashboard/RecentTransactions/RecentTransactionList';
import EntityError from '@/components/entities/EntityError';
import RecentTransactionSkeleton from '@/pages/Dashboard/RecentTransactions/RecentTransactionSkeleton';
import { useTransactions } from '@/hooks/useTransactions';
import EntityEmpty from '@/components/entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const RecentTransactionsContent = () => {
  const { transactions, isLoading, error, refetch } = useTransactions();

  if (error) {
    return <EntityError entityName={'transactions'} refetch={refetch} />;
  }

  if (isLoading) {
    return (
      <>
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
        <RecentTransactionSkeleton />
      </>
    );
  }

  if (transactions.length === 0) {
    return <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />;
  }

  return <RecentTransactionList />;
};

export default RecentTransactionsContent;
