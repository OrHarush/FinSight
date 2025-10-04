import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import { FormProvider, useForm } from 'react-hook-form';
import AccountForm from '@/components/Dialogs/AccountDialogs/AccountForm';
import { AccountDto, AccountFormValues } from '@/types/Account';
import { UpdateAccountCommand } from '../../../../../shared/types/AccountCommands';

interface EditAccountDialogProps extends DialogProps {
  account: AccountDto;
}

const EditAccountDialog = ({ isOpen, closeDialog, account }: EditAccountDialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<AccountFormValues>({
    defaultValues: {
      name: account.name,
      balance: account.balance,
      institution: account.institution,
      accountNumber: account.accountNumber,
      icon: account.icon,
      isPrimary: account.isPrimary,
    },
  });

  const updateAccount = useApiMutation<AccountDto, UpdateAccountCommand>({
    method: 'put',
    url: `${API_ROUTES.ACCOUNTS}/${account._id}`,
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const update = async (data: AccountFormValues) => {
    try {
      console.log(data);
      await updateAccount.mutateAsync({ ...data });
      alertSuccess('Account updated!');
    } catch (err) {
      alertError('Failed to update account.');
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title="Edit Account"
        onSubmit={update}
        isUpdate
      >
        <AccountForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditAccountDialog;
