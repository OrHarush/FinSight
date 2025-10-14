import FormDialog from '@/components/dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import { FormProvider, useForm } from 'react-hook-form';
import CategoryForm from '@/components/dialogs/CategoryDialogs/CategoryForm';
import { UpdateCategoryCommand } from '../../../../../shared/types/CategoryCommands';
import { mapCategoryFormToCommand } from '@/utils/categoryUtils';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';

interface EditCategoryDialogProps extends BaseDialogProps {
  category: CategoryDto;
}

const EditCategoryDialog = ({ isOpen, closeDialog, category }: EditCategoryDialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    },
  });

  const updateCategory = useApiMutation<CategoryDto, UpdateCategoryCommand>({
    method: 'put',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const update = async (data: CategoryFormValues) => {
    try {
      await updateCategory.mutateAsync(mapCategoryFormToCommand(data));
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
        isUpdateForm
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditCategoryDialog;
