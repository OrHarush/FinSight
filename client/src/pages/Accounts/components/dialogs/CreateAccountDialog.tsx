import { CreateAccountDTO, CreateAccountSchema } from '@finsight/shared';
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

const CreateAccountDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('accounts');
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<CreateAccountDTO>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: { icon: 'AccountBalance', currency: 'ILS' },
    mode: 'all',
  });

  const createAccount = useApiMutation<AccountDto, CreateAccountDTO>({
    method: 'post',
    url: API_ROUTES.ACCOUNTS,
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const createNewAccount = async (data: CreateAccountDTO) => {
    try {
      await createAccount.mutateAsync(data);
      alertSuccess(t('messages.createSuccess'));
    } catch (err) {
      alertError(t('messages.createError'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.create')}
        onSubmit={createNewAccount}
      >
        <AccountForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateAccountDialog;
