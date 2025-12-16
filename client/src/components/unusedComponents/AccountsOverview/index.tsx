import Row from '@/components/layout/Containers/Row';
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
import Column from '@/components/layout/Containers/Column';
import { useNavigate } from 'react-router-dom';
import AccountsOverviewContent from '@/components/unusedComponents/AccountsOverview/AccountsOverviewContent';
import { useTranslation } from 'react-i18next';

const AccountsOverview = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ minHeight: '240px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent="space-between" height="100%" spacing={2}>
            <Row justifyContent={'space-between'}>
              <Typography variant="h6">{t('accounts.title')}</Typography>
              {!isMobile && (
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '12px' }}
                  onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                >
                  {t('accounts.manageAccounts')}
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
                {t('accounts.manageAccounts')}
              </Button>
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountsOverview;
