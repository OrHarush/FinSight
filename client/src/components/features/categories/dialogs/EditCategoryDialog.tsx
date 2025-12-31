import FormDialog from '@/components/dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import { FormProvider, useForm } from 'react-hook-form';
import CategoryForm from '@/components/features/categories/components/CategoryForm';
import { UpdateCategoryCommand } from '../../../../../../shared/types/CategoryCommands';
import { getCategoryDisplayName, mapCategoryFormToCommand } from '@/utils/categoryUtils';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';

interface EditCategoryDialogProps extends BaseDialogProps {
  category: CategoryDto;
}

const EditCategoryDialog = ({ isOpen, closeDialog, category }: EditCategoryDialogProps) => {
  const { t } = useTranslation('categories');
  const { alertSuccess, alertError } = useSnackbar();
  console.log(category);
  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      name: getCategoryDisplayName(category, t),
      type: category.type,
      monthlyLimit: category.monthlyLimit,
      color: category.color,
      icon: category.icon,
    },
    mode: 'all',
  });

  const updateCategory = useApiMutation<CategoryDto, UpdateCategoryCommand>({
    method: 'put',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const update = async (data: CategoryFormValues) => {
    try {
      await updateCategory.mutateAsync(mapCategoryFormToCommand(data));
      alertSuccess(t('messages.updateSuccess'));
    } catch (err) {
      alertError(t('messages.updateError'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.edit')}
        onSubmit={update}
        isUpdateForm
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditCategoryDialog;
