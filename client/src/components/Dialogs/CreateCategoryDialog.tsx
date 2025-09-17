import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import ControlledSelect from '@/components/inputs/ControlledSelect';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/APP_ROUTES';

export type CategoryFormData = {
  name: string;
  type: 'Income' | 'Expense';
  color: string;
};

const CreateCategoryDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      type: 'Expense',
      color: '#4CAF50',
    },
  });
  const { control } = methods;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await api.post(API_ROUTES.CATEGORIES, data);

      closeDialog();
    } catch (err) {
      console.error('❌ Failed to save category:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Category'}
        onSubmit={onSubmit}
      >
        <Column spacing={2}>
          <TextInput name={'name'} label={'Name'} />
          <Row spacing={2}>
            <ControlledSelect
              name="type"
              label="Type"
              options={[
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
              ]}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => <TextField {...field} label="Color" type="color" fullWidth />}
            />
          </Row>
        </Column>
      </FormDialog>
    </FormProvider>
  );
};

export default CreateCategoryDialog;
