import AddIcon from '@mui/icons-material/Add';
import { Button, MenuItem, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import AccountMenuItem from '@/components/features/accounts/AccountMenuItem';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import DateSelector from '@/components/shared/ui/DateSelector';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';

interface OverviewHeaderProps {
  openCreateTransaction: () => void;
}

const OverviewHeader = ({ openCreateTransaction }: OverviewHeaderProps) => {
  const { t } = useTranslation('overview');
  const isMobile = useIsMobile();
  const { accounts } = useAccounts();
  const { date, setDate, account, setAccount } = useOverviewFilters();

  const changeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = accounts.find(a => a._id === e.target.value);

    if (selected) {
      setAccount(selected);
    }
  };

  return (
    <PageHeader entityName={'overview'}>
      <ResponsiveRow spacing={2} alignItems="center">
        <DateSelector value={date} onChange={setDate} />
        <TextField
          select
          value={account?._id || 'noAccounts'}
          onChange={changeAccount}
          sx={{ width: '200px' }}
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
        {!isMobile && (
          <Button
            variant={'contained'}
            onClick={openCreateTransaction}
            startIcon={<AddIcon />}
            sx={{ width: '180px' }}
          >
            {t('actions.create', { ns: 'transactions' })}
          </Button>
        )}
      </ResponsiveRow>
    </PageHeader>
  );
};

export default OverviewHeader;
