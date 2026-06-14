import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader, usePrimaryAction } from '@/components/shared/layout/PageHeaderContext';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useOpen } from '@/hooks/common/useOpen';
import AccountsDialogManager from '@/pages/Accounts/AccountsDialogManager';
import AccountsPageContent from '@/pages/Accounts/AccountsPageContent';
import { AccountDto } from '@/types/Account';

const Accounts = () => {
  const { t } = useTranslation('accounts');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedAccount, setSelectedAccount] = useState<AccountDto>();
  const isSmallScreen = useIsSmallScreen();

  usePageHeader(t('pageTitle'));
  usePrimaryAction(openCreateDialog);

  const handleSelectAccount = (account: AccountDto) => {
    setSelectedAccount(account);
  };

  const handleCloseEdit = () => {
    setSelectedAccount(undefined);
  };

  return (
    <PageLayout>
      {!isSmallScreen && (
        <Row justifyContent="flex-end">
          <Button variant="contained" onClick={openCreateDialog} startIcon={<AddIcon />}>
            {t('actions.create')}
          </Button>
        </Row>
      )}
      <AccountsPageContent selectAccount={handleSelectAccount} />
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
