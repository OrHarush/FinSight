import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import Column from '@/components/Layout/Containers/Column';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import TransactionOverview from '@/pages/Dashboard/RecentTransactions/TransactionOverview';
import RecentTransactionSkeleton from '@/pages/Dashboard/RecentTransactions/RecentTransactionSkeleton';
import NoTransactions from '@/components/Placeholders/NoTransactions';

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { transactions, isLoading } = useTransactions();
  const today = new Date();

  const recentTransactions = [...transactions]
    .filter(tx => new Date(tx.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', padding: 4 }}>
          <Column width={'100%'} height={'100%'} spacing={2}>
            <Row width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h6">Recent Transactions</Typography>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(ROUTES.TRANSACTIONS_URL)}
              >
                View All
              </Button>
            </Row>
            {isLoading ? (
              <>
                <RecentTransactionSkeleton />
                <RecentTransactionSkeleton />
                <RecentTransactionSkeleton />
                <RecentTransactionSkeleton />
                <RecentTransactionSkeleton />
              </>
            ) : transactions.length > 0 ? (
              recentTransactions.map(tx => <TransactionOverview key={tx._id} transaction={tx} />)
            ) : (
              <NoTransactions />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecentTransactions;
