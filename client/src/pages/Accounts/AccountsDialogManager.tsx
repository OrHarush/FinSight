import CreateAccountDialog from '@/pages/Accounts/components/dialogs/CreateAccountDialog';
import EditAccountDialog from '@/pages/Accounts/components/dialogs/EditAccountDialog';
import { AccountDto } from '@/types/Account';

interface AccountsDialogManagerProps {
  isCreateOpen: boolean;
  selectedAccount?: AccountDto;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
}

const AccountsDialogManager = ({
  isCreateOpen,
  selectedAccount,
  onCloseCreate,
  onCloseEdit,
}: AccountsDialogManagerProps) => (
  <>
    {isCreateOpen && <CreateAccountDialog isOpen={isCreateOpen} closeDialog={onCloseCreate} />}
    {selectedAccount && (
      <EditAccountDialog
        isOpen={!!selectedAccount}
        closeDialog={onCloseEdit}
        account={selectedAccount}
      />
    )}
  </>
);

export default AccountsDialogManager;
