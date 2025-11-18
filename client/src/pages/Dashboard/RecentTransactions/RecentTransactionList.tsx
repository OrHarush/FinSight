import TransactionOverview from '@/pages/Dashboard/RecentTransactions/TransactionOverview';
import { useTransactions } from '@/hooks/entities/useTransactions';

const RecentTransactionList = () => {
  const { transactions } = useTransactions();
  const today = new Date();

  const recentTransactions = [...transactions]
    .filter(tx => new Date(tx.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return recentTransactions.map(tx => <TransactionOverview key={tx._id} transaction={tx} />);
};

export default RecentTransactionList;
