import RecentTransactionList from '@/pages/Dashboard/RecentTransactions/RecentTransactionList';
import EntityError from '@/components/Entities/EntityError';
import RecentTransactionSkeleton from '@/pages/Dashboard/RecentTransactions/RecentTransactionSkeleton';
import { useTransactions } from '@/hooks/useTransactions';
import EntityEmpty from '@/components/Entities/EntityEmpty';
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
    return (
      <EntityEmpty
        entityName="transactions"
        subtitle="Start by adding your first one"
        icon={ReceiptLongIcon}
      />
    );
  }

  return <RecentTransactionList />;
};

export default RecentTransactionsContent;
