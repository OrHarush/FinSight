import { FormProvider, useForm } from 'react-hook-form';
import FormDialog from '@/components/dialogs/FormDialog';
import { AccountDto, AccountFormValues } from '@/types/Account';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CreateAccountCommand } from '../../../../../shared/types/AccountCommands';
import AccountForm from '@/components/dialogs/AccountDialogs/AccountForm';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';

const CreateAccountDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('accounts');
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
      alertSuccess(t('messages.create_success'));
    } catch (err) {
      alertError(t('messages.create_error'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.create')}
        onSubmit={submitNewAccount}
      >
        <AccountForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateAccountDialog;
