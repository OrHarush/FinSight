import { FormProvider, useForm } from 'react-hook-form';
import FormDialog, { DialogProps } from '../FormDialog';
import { AccountDto, AccountFormValues } from '@/types/Account';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CreateAccountCommand } from '../../../../../shared/types/AccountCommands';
import AccountForm from '@/components/Dialogs/AccountDialogs/AccountForm';

const CreateAccountDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<AccountFormValues>({
    defaultValues: { icon: 'AccountBalance' },
  });

  const createAccount = useApiMutation<AccountDto, CreateAccountCommand>({
    method: 'post',
    url: API_ROUTES.ACCOUNTS,
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const submitNewAccount = async (data: AccountFormValues) => {
    try {
      await createAccount.mutateAsync(data);
      alertSuccess('Account created!');
    } catch (err) {
      alertError('Failed to create account.');
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Account'}
        onSubmit={submitNewAccount}
      >
        <AccountForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateAccountDialog;
