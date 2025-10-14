import { Box } from '@mui/material';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import EntityEmpty from '@/components/entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Dayjs } from 'dayjs';
import { useTransactions } from '@/hooks/useTransactions';

interface TransactionsCardsViewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const { transactions } = useTransactions();

  if (!transactions.length) {
    return <EntityEmpty entityName={'transactions'} icon={ReceiptLongIcon} />;
  }

  return (
    <Box display="flex" flexDirection="column">
      {transactions.map(transaction => (
        <TransactionCard key={transaction._id} transaction={transaction} />
      ))}
    </Box>
  );
};

export default TransactionsCardsView;
