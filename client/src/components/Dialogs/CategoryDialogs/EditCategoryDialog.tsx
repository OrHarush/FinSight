import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/CategoryDto';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import { FormProvider, useForm } from 'react-hook-form';
import CategoryForm from '@/components/Dialogs/CategoryDialogs/CategoryForm';
import { TransactionType } from '@/types/Transaction';

interface EditCategoryDialogProps extends DialogProps {
  category: CategoryDto;
}

const EditCategoryDialog = ({ isOpen, closeDialog, category }: EditCategoryDialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      name: category.name,
      type: category.type == 'Income' ? TransactionType.Income : TransactionType.Expense,
      color: category.color,
      icon: category.icon,
    },
  });

  const updateCategory = useApiMutation<CategoryDto, CategoryFormValues>({
    method: 'put',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const update = async (data: CategoryFormValues) => {
    try {
      await updateCategory.mutateAsync(data);
      alertSuccess('Category updated!');
      closeDialog();
    } catch (err) {
      alertError('Failed to update category.');
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title="Edit Category"
        onSubmit={update}
        isUpdate
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditCategoryDialog;
