import { Button } from '@mui/material';
import CreateAccountDialog from '@/components/features/accounts/dialogs/CreateAccountDialog';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { useState } from 'react';
import { AccountDto } from '@/types/Account';
import EditAccountDialog from '@/components/features/accounts/dialogs/EditAccountDialog';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';
import { useOpen } from '@/hooks/useOpen';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';
import AddIcon from '@mui/icons-material/Add';

const Accounts = () => {
  const { t } = useTranslation('accounts');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedAccount, setSelectedAccount] = useState<AccountDto>();
  const isMobile = useIsMobile();

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
          <Button variant="contained" onClick={openCreateDialog} startIcon={<AddIcon />}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <AccountsPageContent selectAccount={selectAccount} />
      <ActionFab onClick={openCreateDialog} />
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
