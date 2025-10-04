import { Button, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import { useOpen } from '@/hooks/useOpen';
import CreateAccountDialog from '@/components/Dialogs/AccountDialogs/CreateAccountDialog';
import PageLayout from '@/components/Layout/PageLayout';
import { useState } from 'react';
import { AccountDto } from '@/types/Account';
import EditAccountDialog from '@/components/Dialogs/AccountDialogs/EditAccountDialog';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';

const Accounts = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedAccount, setSelectedAccount] = useState<AccountDto>();

  const selectAccount = (account: AccountDto) => {
    setSelectedAccount(account);
  };

  const closeEditDialogAndReset = () => {
    setSelectedAccount(undefined);
  };

  return (
    <PageLayout>
      <Row alignItems="center" justifyContent="space-between" flexWrap="wrap" spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Accounts
        </Typography>
        <Button variant="outlined" onClick={openCreateDialog}>
          Create Account
        </Button>
      </Row>
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
