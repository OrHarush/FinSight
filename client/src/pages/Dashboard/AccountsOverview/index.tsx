import Row from '@/components/Layout/Containers/Row';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { ROUTES } from '@/constants/Routes';
import Column from '@/components/Layout/Containers/Column';
import { useNavigate } from 'react-router-dom';
import AccountsContent from '@/pages/Dashboard/AccountsOverview/AccountsContent';

const AccountsOverview = () => {
  const navigate = useNavigate();

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ height: '220px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent="space-between" height="100%" spacing={2}>
            <Row justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h6">Accounts</Typography>
              <Button
                variant="outlined"
                sx={{ borderRadius: '12px' }}
                onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
              >
                Manage Accounts
              </Button>
            </Row>
            <AccountsContent />
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountsOverview;
