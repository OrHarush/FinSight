import Row from '@/components/Layout/Containers/Row';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ROUTES } from '@/constants/Routes';
import Column from '@/components/Layout/Containers/Column';
import { useNavigate } from 'react-router-dom';
import AccountsOverviewContent from '@/pages/Dashboard/AccountsOverview/AccountsOverviewContent';

const AccountsOverview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ minHeight: '240px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent="space-between" height="100%" spacing={2}>
            <Row justifyContent={'space-between'}>
              <Typography variant="h6">Accounts</Typography>
              {!isMobile && (
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '12px' }}
                  onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                >
                  Manage Accounts
                </Button>
              )}
            </Row>
            <AccountsOverviewContent />
            {isMobile && (
              <Button
                variant="outlined"
                sx={{ borderRadius: '12px' }}
                onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
              >
                Manage Accounts
              </Button>
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountsOverview;
