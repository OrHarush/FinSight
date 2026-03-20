import { CreateAccountDTO, UpdateAccountDTO, UpdateAccountSchema } from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import AccountForm from '@/pages/Accounts/components/AccountForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AccountDto } from '@/types/Account';

interface EditAccountDialogProps extends BaseDialogProps {
  account: AccountDto;
}

const EditAccountDialog = ({ isOpen, closeDialog, account }: EditAccountDialogProps) => {
  const { t } = useTranslation('accounts');
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<CreateAccountDTO>({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      name: account.name,
      balance: account.balance,
      institution: account.institution,
      accountNumber: account.accountNumber,
      icon: account.icon,
      currency: account.currency ?? 'ILS',
      isPrimary: account.isPrimary,
    },
  });

  const updateAccount = useApiMutation<AccountDto, UpdateAccountDTO>({
    method: 'put',
    url: `${API_ROUTES.ACCOUNTS}/${account._id}`,
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const update = async (data: CreateAccountDTO) => {
    try {
      await updateAccount.mutateAsync(data);
      alertSuccess(t('messages.updateSuccess'));
    } catch (err) {
      alertError(t('messages.updateError'));
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
