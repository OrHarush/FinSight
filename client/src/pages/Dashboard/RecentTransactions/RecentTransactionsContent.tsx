import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import RecentTransactionList from '@/pages/Dashboard/RecentTransactions/RecentTransactionList';
import EntityError from '@/components/Entities/EntityError';
import RecentTransactionSkeleton from '@/pages/Dashboard/RecentTransactions/RecentTransactionSkeleton';

const RecentTransactionsContent = () => {
  const { isLoading, error, refetch } = useTransactions();

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

  return <RecentTransactionList />;
};

export default RecentTransactionsContent;
