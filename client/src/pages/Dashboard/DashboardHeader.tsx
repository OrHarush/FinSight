import PageHeader from '@/components/layout/Page/PageHeader';
import { useAccounts } from '@/hooks/useAccounts';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { MenuItem, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import AccountMenuItem from '@/components/accounts/AccountMenuItem';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import DateSelector from '@/components/appCommon/DateSelector';

const DashboardHeader = () => {
  const { t } = useTranslation('dashboard');
  const { accounts } = useAccounts();
  const { date, setDate, account, setAccount } = useDashboardFilters();

  const changeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = accounts.find(a => a._id === e.target.value);

    if (selected) {
      setAccount(selected);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <PageHeader entityName={'dashboard'}>
      <Stack spacing={2} alignItems="center" direction={isMobile ? 'column' : 'row'}>
        <DateSelector allowYearSelection value={date} onChange={setDate} />
        <TextField
          select
          value={account?._id || 'noAccounts'}
          onChange={changeAccount}
          sx={{ width: '240px' }}
          disabled={accounts?.length === 0}
        >
          {accounts?.length === 0 && (
            <MenuItem key={'noAccounts'} value={'noAccounts'}>
              <AccountMenuItem
                account={{
                  name: t('accountSelector.placeholder'),
                  icon: 'AccountBalanceIcon',
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
      </Stack>
    </PageHeader>
  );
};

export default DashboardHeader;
