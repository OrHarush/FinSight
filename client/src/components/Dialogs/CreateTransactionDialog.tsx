import { Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { CategoryDto } from '@/types/CategoryDto';
import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@/components/inputs/TextInput';
import ControlledSelect from '@/components/inputs/ControlledSelect';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useFetch } from '@/hooks/useFetch';
import { TransactionFormValues } from '@/types/Transaction';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/APP_ROUTES';

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const CreateTransactionDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const methods = useForm<TransactionFormValues>({
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      recurrence: 'None',
      category: '',
      accountRelated: '',
    },
  });

  const { data: categories = [], isLoading } = useFetch<CategoryDto[]>({
    url: API_ROUTES.CATEGORIES,
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      await api.post(API_ROUTES.TRANSACTIONS, {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
      });

      console.log('✅ Transaction created');
      closeDialog();
    } catch (err) {
      console.error('❌ Failed to create transaction:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Transaction'}
        onSubmit={handleSubmit}
      >
        <Column spacing={2}>
          <TextInput name={'name'} label={'Name'} required />
          <Row spacing={2}>
            <TextInput name={'amount'} label={'Amount'} type={'number'} min={1} required />
            {!isLoading ? (
              <ControlledSelect
                name={'category'}
                label={'Category'}
                required
                options={categories.map(category => ({
                  label: category.name,
                  value: category._id,
                }))}
              />
            ) : (
              <Typography>Text...</Typography>
            )}
          </Row>
          <Row spacing={2}>
            <TextInput name={'date'} label={'Transaction date'} type={'date'} />
            <ControlledSelect
              name={'recurrence'}
              label={'Recurrence'}
              required
              options={recurrenceOptions.map(option => ({
                label: option,
                value: option,
              }))}
            />
          </Row>
          <ControlledSelect
            name={'accountRelated'}
            label={'Account'}
            required
            options={[
              {
                label: 'test',
                value: 'test',
                design: (
                  <Row spacing={1}>
                    <AccountBalanceIcon />
                    <Typography>test</Typography>
                  </Row>
                ),
              },
            ]}
          />
        </Column>
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
