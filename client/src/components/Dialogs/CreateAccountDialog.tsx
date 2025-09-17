import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@/components/inputs/TextInput';
import FormDialog, { DialogProps } from './FormDialog';
import { AccountFormValues } from '@/types/Account';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import api from '@/api/axios';

const CreateAccountDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const methods = useForm<AccountFormValues>();

  const handleSubmit = async (data: AccountFormValues) => {
    try {
      console.log(data);
      await api.post(API_ROUTES.ACCOUNTS, data);

      closeDialog();
    } catch (err) {
      console.error('❌ Failed to create account:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Account'}
        onSubmit={handleSubmit}
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
