import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { useState } from 'react';
import { AccountDto } from '@/types/Account';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';
import AccountsDialogManager from '@/pages/Accounts/AccountsDialogManager';
import { useOpen } from '@/hooks/common/useOpen';
import PageHeader from '@/components/shared/layout/page/PageHeader';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const Accounts = () => {
  const { t } = useTranslation('accounts');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedAccount, setSelectedAccount] = useState<AccountDto>();
  const isMobile = useIsMobile();

  const handleSelectAccount = (account: AccountDto) => {
    setSelectedAccount(account);
  };

  const handleCloseEdit = () => {
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
      <AccountsPageContent selectAccount={handleSelectAccount} />
      <ActionFab onClick={openCreateDialog} />
      <AccountsDialogManager
        isCreateOpen={isCreateDialogOpen}
        selectedAccount={selectedAccount}
        onCloseCreate={closeCreateDialog}
        onCloseEdit={handleCloseEdit}
      />
    </PageLayout>
  );
};

export default Accounts;
