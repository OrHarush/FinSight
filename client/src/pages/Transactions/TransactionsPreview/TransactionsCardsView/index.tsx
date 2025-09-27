import { Box } from '@mui/material';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { ExtendedTransaction } from '@/types/Transaction';

interface TransactionsCardsViewProps {
  filteredTransactions: ExtendedTransaction[];
}

const TransactionsCardsView = ({ filteredTransactions }: TransactionsCardsViewProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {filteredTransactions.length ? (
        filteredTransactions.map(transaction => (
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
