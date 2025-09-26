import { Box } from '@mui/material';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionCardView/TransactionCard';
import NoTransactions from '@/components/Placeholders/NoTransactions';

const TransactionCardsView = () => {
  const { transactions } = useTransactions();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {transactions.length ? (
        transactions.map(transaction => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))
      ) : (
        <NoTransactions />
      )}
    </Box>
  );
};

export default TransactionCardsView;
