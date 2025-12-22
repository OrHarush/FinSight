import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';

const formatAmount = (value: number) => `₪${Math.abs(value).toLocaleString()}`;

const MonthlyHeroStrip = () => {
  const { year, month, account } = useDashboardFilters();

  const { data, isLoading } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Loading monthly status…
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;
  const net = income - expenses;

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ py: 1.5 }}>
        <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid
            size={{ xs: 6, md: 4 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="text.secondary">
                Income
              </Typography>
            </Box>
            <Typography variant="h5" color={'success'}>
              {formatAmount(income)}
            </Typography>
          </Grid>

          {/* Expenses */}
          <Grid
            size={{ xs: 6, md: 4 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <TrendingDownIcon fontSize="small" color="error" />
              <Typography variant="body2" color="text.secondary">
                Expenses
              </Typography>
            </Box>
            <Typography variant="h5" color={'error'}>
              {formatAmount(expenses)}
            </Typography>
          </Grid>

          {/* Net */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              {/*<AccountBalanceWalletIcon fontSize="small" color={net >= 0 ? 'success' : 'error'} />*/}
              {/*<Typography variant="body2" color="text.secondary">*/}
              {/*  Net*/}
              {/*</Typography>*/}
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color={net >= 0 ? 'success.main' : 'error.main'}
            >
              {net >= 0 && '+'}
              {formatAmount(net)}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default MonthlyHeroStrip;
