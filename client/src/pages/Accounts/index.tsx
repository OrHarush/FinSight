import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageHeader from '@/components/shared/layout/page/PageHeader';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import AccountsDialogManager from '@/pages/Accounts/AccountsDialogManager';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';
import { AccountDto } from '@/types/Account';

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
