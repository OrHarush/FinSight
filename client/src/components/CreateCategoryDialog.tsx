import { FormEvent, useState } from 'react';
import FormDialog from '@/components/FormDialog';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import ControlledSelect from '@/components/inputs/ControlledSelect';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';

export interface CreateCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export type CategoryFormData = {
  name: string;
  type: 'Income' | 'Expense';
  color: string;
};

const CreateCategoryDialog = ({ open, onClose, onSubmit }: CreateCategoryDialogProps) => {
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      type: 'Expense',
      color: '#4CAF50',
    },
  });
  const { control } = methods;

  return (
    <FormProvider {...methods}>
      <FormDialog isOpen={open} close={onClose} title={'Create Category'} onSubmit={onSubmit}>
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
