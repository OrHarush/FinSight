import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import CategoryForm from '@/components/Dialogs/CategoryDialogs/CategoryForm';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateCategoryCommand } from '../../../../../shared/types/CategoryCommands';
import { mapCategoryFormToCommand } from '@/utils/categoryUtils';
import { useEffect } from 'react';

const CreateCategoryDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      type: 'Expense',
      color: '#4CAF50',
      icon: 'CategoryIcon',
      monthlyLimit: 0,
    },
  });

  const createCategory = useApiMutation<CategoryDto, CreateCategoryCommand>({
    method: 'post',
    url: API_ROUTES.CATEGORIES,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const submitNewCategory = async (data: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync(mapCategoryFormToCommand(data));
      alertSuccess('Category created!');
    } catch (err) {
      alertError('Failed to create category.');
      console.error(err);
    }
  };

  const name = methods.watch('name');

  useEffect(() => {
    console.log('name changed:', name);
  }, [name]);
  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title="New Category"
        onSubmit={submitNewCategory}
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateCategoryDialog;
