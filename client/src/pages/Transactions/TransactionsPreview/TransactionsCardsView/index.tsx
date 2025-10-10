import { Box } from '@mui/material';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Dayjs } from 'dayjs';
import { useTransactions } from '@/hooks/useTransactions';

interface TransactionsCardsViewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const { transactions } = useTransactions();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {transactions.length ? (
        transactions.map(transaction => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))
      ) : (
        <EntityEmpty
          entityName={'transactions'}
          subtitle={'Start by adding your first one'}
          icon={ReceiptLongIcon}
        />
      )}
    </Box>
  );
};

export default TransactionsCardsView;
