import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/CategoryDto';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import CategoryForm from '@/components/Dialogs/CategoryDialogs/CategoryForm';
import { FormProvider, useForm } from 'react-hook-form';
import { TransactionType } from '@/types/Transaction';

const CreateCategoryDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
      type: TransactionType.Expense,
      color: '#4CAF50',
    },
  });

  const createCategory = useApiMutation<CategoryDto, CategoryFormValues>({
    method: 'post',
    url: API_ROUTES.CATEGORIES,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const submitNewCategory = async (data: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync(data);
      alertSuccess('Category created!');
      closeDialog();
    } catch (err) {
      alertError('Failed to create category.');
      console.error(err);
    }
  };

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
