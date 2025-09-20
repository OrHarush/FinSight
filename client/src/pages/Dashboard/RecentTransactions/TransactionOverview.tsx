import Row from '@/components/Layout/Row';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import Column from '@/components/Layout/Column';
import { Typography } from '@mui/material';
import { TransactionDto } from '@/types/Transaction';

interface TransactionOverviewProps {
  transaction: TransactionDto;
}

const TransactionOverview = ({ transaction }: TransactionOverviewProps) => {
  const isIncome = (transaction: TransactionDto) => transaction?.category?.type === 'Income';

  return (
    <Row key={transaction._id} justifyContent="space-between" alignItems="center">
      <Row spacing={2} alignItems="center">
        {isIncome(transaction) ? (
          <CallReceivedIcon color="success" />
        ) : (
          <CallMadeIcon color="error" />
        )}
        <Column>
          <Typography variant="body1">{transaction.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(transaction.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        </Column>
      </Row>
      <Typography color={isIncome(transaction) ? 'success.main' : 'error.main'} fontWeight={600}>
        {isIncome(transaction) ? `+${transaction.amount}₪` : `-${transaction.amount}₪`}
      </Typography>
    </Row>
  );
};

export default TransactionOverview;
