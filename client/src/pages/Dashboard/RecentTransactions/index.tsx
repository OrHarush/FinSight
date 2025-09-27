import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
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
            <RecentTransactionsContent />
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecentTransactions;
