import { Button, Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import { useTransactions } from '@/providers/TransactionsProvider';
import { TransactionDto } from '@/types/Transaction';

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { transactions, isLoading } = useTransactions();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  console.log(transactions);

  const isIncome = (transaction: TransactionDto) => transaction.category.type === 'Income';

  return (
    <Card sx={{ width: '600px' }}>
      <CardContent sx={{ padding: 4 }}>
        <Column spacing={4} width={'100%'}>
          <Row width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(APP_ROUTES.TRANSACTIONS_URL)}
            >
              View All
            </Button>
          </Row>
          {isLoading && <Typography>Loading...</Typography>}
          {!isLoading &&
            recentTransactions.map(tx => (
              <Row key={tx._id} justifyContent="space-between" alignItems="center">
                <Row spacing={2} alignItems="center">
                  {isIncome(tx) ? (
                    <CallReceivedIcon color="success" />
                  ) : (
                    <CallMadeIcon color="error" />
                  )}
                  <Column>
                    <Typography variant="body1">{tx.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Column>
                </Row>
                <Typography color={isIncome(tx) ? 'success.main' : 'error.main'} fontWeight={600}>
                  {isIncome(tx) ? `+${tx.amount}₪` : `-${tx.amount}₪`}
                </Typography>
              </Row>
            ))}
        </Column>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
