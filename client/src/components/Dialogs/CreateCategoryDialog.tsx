import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import ControlledSelect from '@/components/inputs/ControlledSelect';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Row';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import { TransactionType } from '@/types/Transaction';
import { useOpen } from '@/hooks/useOpen';
import IconPickerDialog from '@/components/IconPickerDialog';
import Column from '@/components/Layout/Column';

export type CategoryFormData = {
  name: string;
  type: TransactionType;
  color: string;
};

const CreateCategoryDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const [isIconsOpen, openIconsDialog, closeIconsDigalog] = useOpen();
  const methods = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      type: TransactionType.Expense,
      color: '#4CAF50',
    },
  });
  const { control } = methods;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await api.post(API_ROUTES.CATEGORIES, {
        ...data,
        type: TransactionType.Income ? 'Income' : 'Expense',
      });

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
        title={'New Category'}
        onSubmit={onSubmit}
      >
        <Column spacing={2}>
          <TextInput name={'name'} label={'Name'} />
          <ControlledSelect
            name="type"
            label="Type"
            options={[
              { value: TransactionType.Income, label: 'Income' },
              { value: TransactionType.Expense, label: 'Expense' },
            ]}
          />
          <ControlledSelect
            name="icon"
            label="Icon"
            options={[
              { value: TransactionType.Income, label: 'Income' },
              { value: TransactionType.Expense, label: 'Expense' },
            ]}
          />
          <ControlledSelect
            name="color"
            label="Color"
            options={[
              { value: TransactionType.Income, label: 'Income' },
              { value: TransactionType.Expense, label: 'Expense' },
            ]}
          />
          {/*<Controller*/}
          {/*  name="color"*/}
          {/*  control={control}*/}
          {/*  render={({ field }) => (*/}
          {/*    <Box sx={{ position: 'relative', display: 'inline-block' }}>*/}
          {/*      <Box*/}
          {/*        sx={{*/}
          {/*          width: 32,*/}
          {/*          height: 32,*/}
          {/*          borderRadius: '50%',*/}
          {/*          border: '2px solid #ccc',*/}
          {/*          marginTop: '16px',*/}
          {/*          backgroundColor: field.value || '#000',*/}
          {/*          cursor: 'pointer',*/}
          {/*        }}*/}
          {/*      />*/}
          {/*      <input*/}
          {/*        type="color"*/}
          {/*        value={field.value}*/}
          {/*        onChange={field.onChange}*/}
          {/*        style={{*/}
          {/*          position: 'absolute',*/}
          {/*          top: 0,*/}
          {/*          left: 0,*/}
          {/*          width: '100%',*/}
          {/*          height: '100%',*/}
          {/*          opacity: 0,*/}
          {/*          cursor: 'pointer',*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    </Box>*/}
          {/*  )}*/}
          {/*/>*/}
        </Column>
        <IconPickerDialog
          selectIcon={(icon: string) => {
            console.log(icon);
          }}
          isOpen={isIconsOpen}
          closeDialog={closeIconsDigalog}
        />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateCategoryDialog;
