import { Button, useMediaQuery, useTheme } from '@mui/material';
import CreateAccountDialog from '@/components/dialogs/AccountDialogs/CreateAccountDialog';
import PageLayout from '@/components/layout/PageLayout';
import { useState } from 'react';
import { AccountDto } from '@/types/Account';
import EditAccountDialog from '@/components/dialogs/AccountDialogs/EditAccountDialog';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';
import { useOpen } from '@/hooks/useOpen';
import PageHeader from '@/components/layout/PageHeader';
import ActionFab from '@/components/common/ActionFab';
import { useTranslation } from 'react-i18next';

const Accounts = () => {
  const { t } = useTranslation('accounts');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedAccount, setSelectedAccount] = useState<AccountDto>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const selectAccount = (account: AccountDto) => {
    setSelectedAccount(account);
  };

  const closeEditDialogAndReset = () => {
    setSelectedAccount(undefined);
  };

  return (
    <PageLayout>
      <PageHeader entityName={'accounts'}>
        {!isMobile && (
          <Button variant="contained" onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <ActionFab onClick={openCreateDialog} />
      <AccountsPageContent selectAccount={selectAccount} />
      {isCreateDialogOpen && (
        <CreateAccountDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {!!selectedAccount && (
        <EditAccountDialog
          isOpen={!!selectedAccount}
          closeDialog={closeEditDialogAndReset}
          account={selectedAccount}
        />
      )}
    </PageLayout>
  );
};

export default Accounts;
