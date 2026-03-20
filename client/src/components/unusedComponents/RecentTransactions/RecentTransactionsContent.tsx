import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import RecentTransactionList from '@/components/unusedComponents/RecentTransactions/RecentTransactionList';
import RecentTransactionSkeleton from '@/components/unusedComponents/RecentTransactions/RecentTransactionSkeleton';
import { useTransactions } from '@/hooks/entities/useTransactions';

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
