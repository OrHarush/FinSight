import FormDialog from '@/components/dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import { FormProvider, useForm } from 'react-hook-form';
import AccountForm from '@/components/dialogs/AccountDialogs/AccountForm';
import { AccountDto, AccountFormValues } from '@/types/Account';
import { UpdateAccountCommand } from '../../../../../shared/types/AccountCommands';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';

interface EditAccountDialogProps extends BaseDialogProps {
  account: AccountDto;
}

const EditAccountDialog = ({ isOpen, closeDialog, account }: EditAccountDialogProps) => {
  const { t } = useTranslation('accounts');
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
      await updateAccount.mutateAsync(data);
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
        title={t('actions.edit')}
        onSubmit={update}
        isUpdateForm
      >
        <AccountForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditAccountDialog;
