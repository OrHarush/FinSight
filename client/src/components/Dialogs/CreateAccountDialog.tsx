import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@/components/inputs/TextInput';
import FormDialog, { DialogProps } from './FormDialog';
import { AccountDto, AccountFormValues } from '@/types/Account';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';

const CreateAccountDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<AccountFormValues>();

  const createAccount = useApiMutation<AccountDto, AccountFormValues>({
    method: 'post',
    url: API_ROUTES.ACCOUNTS,
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const submitNewAccount = async (data: AccountFormValues) => {
    try {
      await createAccount.mutateAsync(data);
      alertSuccess('Account created!');
      closeDialog();
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
        <Column spacing={2}>
          <TextInput name="name" label="Account Name" required />
          <TextInput name="balance" label="Balance" type="number" min={0} required />
          <Row spacing={2}>
            <TextInput name="institution" label="Institution" />
            <TextInput name="accountNumber" label="Account Number" required />
          </Row>
        </Column>
      </FormDialog>
    </FormProvider>
  );
};

export default CreateAccountDialog;
