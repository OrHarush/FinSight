import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import { useTransactions } from '@/providers/TransactionsProvider';
import TransactionOverview from '@/pages/Dashboard/RecentTransactions/TransactionOverview';

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
        <CardContent sx={{ padding: 4 }}>
          <Column spacing={4} width={'100%'}>
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
            {isLoading && <Typography>Loading...</Typography>}
            {!isLoading &&
              recentTransactions.map(tx => <TransactionOverview key={tx._id} transaction={tx} />)}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecentTransactions;
