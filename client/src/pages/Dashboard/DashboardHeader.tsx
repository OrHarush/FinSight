import Row from '@/components/Layout/Containers/Row';
import PageHeader from '@/components/Layout/PageHeader';
import { useAccounts } from '@/hooks/useAccounts';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MenuItem, TextField } from '@mui/material';
import AccountMenuItem from '@/components/Accounts/AccountMenuItem';
import { ChangeEvent } from 'react';

const DashboardHeader = () => {
  const { accounts } = useAccounts();
  const { date, setDate, account, setAccount } = useDashboardFilters();

  const changeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = accounts.find(a => a._id === e.target.value);

    if (selected) {
      setAccount(selected);
    }
  };

  return (
    <PageHeader pageTitle={'Financial Dashboard'}>
      <Row spacing={2} alignItems="center">
        <DatePicker
          views={['year', 'month']}
          value={date}
          onChange={newDate => {
            if (newDate) {
              setDate(newDate);
            }
          }}
        />
        <TextField
          select
          value={account?._id || ''}
          onChange={changeAccount}
          sx={{ width: '240px' }}
          disabled={accounts?.length === 0}
        >
          {accounts.map(account => (
            <MenuItem key={account._id} value={account._id}>
              <AccountMenuItem account={account} />
            </MenuItem>
          ))}
        </TextField>
      </Row>
    </PageHeader>
  );
};

export default DashboardHeader;
