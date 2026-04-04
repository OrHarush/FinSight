import SavingsIcon from '@mui/icons-material/Savings';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  alpha,
  Card,
  Divider,
  Grid,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import AccountMenuItem from '@/components/features/accounts/AccountMenuItem';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useNavBarDate, usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useAccounts } from '@/hooks/entities/useAccounts';
import BalanceHeadline from '@/pages/Overview/MonthlyFinancialOverview/BalanceHeadline';
import IncomeUsageMeter from '@/pages/Overview/MonthlyFinancialOverview/IncomeUsageMeter';
import MonthlyFinancialOverviewSkeleton from '@/pages/Overview/MonthlyFinancialOverview/MonthlyFinancialOverviewSkeleton';
import OverviewMetric from '@/pages/Overview/MonthlyFinancialOverview/OverviewMetric';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import { TransactionSummaryDto } from '@/types/Transaction';

const MonthlyFinancialOverview = () => {
  const { t } = useTranslation('overview');
  const theme = useTheme();
  const { year, month, account, date, setDate, setAccount } = useOverviewFilters();

  const isNotPC = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useIsMobile();

  const { data, isLoading } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month + 1, account?._id),
    queryKey: queryKeys.transactionSummary(year, month + 1, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const { accounts } = useAccounts();

  usePageHeader(t('pageTitle'), true);
  useNavBarDate(date, setDate);

  const changeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = accounts.find(a => a._id === e.target.value);

    if (selected) {
      setAccount(selected);
    }
  };

  if (isLoading) {
    return <MonthlyFinancialOverviewSkeleton />;
  }

  if (!account) {
    return null;
  }

  const income = data?.monthlyIncome ?? 0;
  const expenses = data?.monthlyExpenses ?? 0;
  const net = income - expenses;
  const projected = account.balance + net;

  return (
    <Grid size={{ xs: 12, md: 6, xl: 5 }}>
      <Card sx={{ p: 3, height: '100%' }}>
        <Column height={'100%'} justifyContent={'center'} spacing={2}>
          <TextField
            select
            value={account?._id || 'noAccounts'}
            onChange={changeAccount}
            sx={{
              alignSelf: isMobile ? 'center' : 'start',
              width: 200,
              '& .MuiOutlinedInput-root': {
                height: 40,
                borderRadius: '8px',
                backgroundColor: alpha(theme.palette.background.paper, 0.4), // Subtle depth
              },
            }}
            disabled={accounts?.length === 0}
          >
            {accounts?.length === 0 && (
              <MenuItem key={'noAccounts'} value={'noAccounts'}>
                <AccountMenuItem
                  account={{
                    name: t('accountSelector.placeholder'),
                    icon: 'AccountBalance',
                    accountNumber: '123',
                    balance: 23,
                    institution: 'Leumi',
                    isPrimary: false,
                    _id: 'empty account',
                    lastSynced: new Date(),
                  }}
                />
              </MenuItem>
            )}
            {accounts.map(account => (
              <MenuItem key={account._id} value={account._id}>
                <AccountMenuItem account={account} />
              </MenuItem>
            ))}
          </TextField>
          <Row spacing={1} alignItems="center" justifyContent="space-evenly">
            <BalanceHeadline balance={account.balance} label={t('general.balance')} />
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: 'divider' }} />
            <BalanceHeadline balance={projected} label={t('general.projectedBalance')} />
          </Row>
          <Column spacing={1}>
            <Row spacing={2} justifyContent="space-evenly">
              <OverviewMetric
                icon={TrendingUpIcon}
                value={Math.abs(income)}
                label={t('general.income')}
                color="success"
              />
              <OverviewMetric
                icon={TrendingDownIcon}
                value={Math.abs(expenses)}
                label={t('general.expenses')}
                color="error"
              />
              {!isNotPC && (
                <OverviewMetric
                  icon={SavingsIcon}
                  value={net}
                  label={t('general.net')}
                  color={net >= 0 ? 'success' : 'error'}
                  hasColor
                  hasSign
                />
              )}
            </Row>
            <IncomeUsageMeter income={income} expenses={expenses} />
          </Column>
        </Column>
      </Card>
    </Grid>
  );
};

export default MonthlyFinancialOverview;
