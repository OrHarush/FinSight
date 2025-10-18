import { Box } from '@mui/material';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import { TransactionDto } from '@/types/Transaction';
import { PaginationMeta } from '@/hooks/useFetch';

interface TransactionsCardsViewProps {
  transactions: TransactionDto[];
  pagination?: PaginationMeta;
}

const TransactionsCardsView = ({ transactions, pagination }: TransactionsCardsViewProps) => (
  <Box display="flex" flexDirection="column">
    {transactions.map(transaction => (
      <TransactionCard key={transaction._id} transaction={transaction} />
    ))}
  </Box>
);

export default TransactionsCardsView;
