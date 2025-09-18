import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import ControlledSelect from '@/components/inputs/ControlledSelect';
import TextInput from '@/components/inputs/TextInput';
import api from '@/api/axios';
import * as Icons from '@mui/icons-material';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import { TransactionType } from '@/types/Transaction';
import { useOpen } from '@/hooks/useOpen';
import IconPickerDialog from '@/components/Dialogs/IconPickerDialog';
import Column from '@/components/Layout/Column';
import CategoryIcon from '@mui/icons-material/Category';

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
          <TextInput name="name" label="Name" />

          <ControlledSelect
            name="type"
            label="Type"
            options={[
              { value: 'Income', label: 'Income' },
              { value: 'Expense', label: 'Expense' },
            ]}
          />

          <Controller
            name="icon"
            control={control}
            render={({ field }) => {
              const IconComponent = (Icons as any)[field.value] ?? Icons.Tag; // fallback

              return (
                <TextField
                  {...field}
                  label="Icon"
                  value={field.value}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton>
                          <CategoryIcon fontSize="small" />

                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              );
            }}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <>
                <TextField
                  label="Color"
                  value={field.value}
                  onClick={() => document.getElementById('color-picker')?.click()}
                  slotProps={{
                    htmlInput: {

                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: field.value,
                            border: '1px solid #ccc',
                          }}
                        />
                      </InputAdornment>
                    ),
                    }
                  }}
                  fullWidth
                />
                <input
                  id="color-picker"
                  type="color"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ display: 'none' }}
                />
              </>
            )}
          />
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
