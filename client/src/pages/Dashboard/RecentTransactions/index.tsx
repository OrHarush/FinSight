import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Column from '@/components/Layout/Containers/Column';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import RecentTransactionsContent from '@/pages/Dashboard/RecentTransactions/RecentTransactionsContent';

const RecentTransactions = () => {
  const navigate = useNavigate();

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '100%', minWidth: '240px' }}>
        <CardContent sx={{ height: '100%', padding: 4 }}>
          <Column width={'100%'} height={'100%'} justifyContent={'space-between'} spacing={1}>
            <Column spacing={2} height={'100%'}>
              <Typography variant="h6">Recent Transactions</Typography>
              <RecentTransactionsContent />
            </Column>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(ROUTES.TRANSACTIONS_URL)}
              sx={{ justifySelf: 'flex-end' }}
            >
              View All
            </Button>
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecentTransactions;
