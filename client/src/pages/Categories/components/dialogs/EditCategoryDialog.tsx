import { UpdateCategoryDTO, UpdateCategorySchema } from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import { useApiMutation } from '@/hooks/useApiMutation';
import CategoryForm from '@/pages/Categories/components/CategoryForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto } from '@/types/Category';

interface EditCategoryDialogProps extends BaseDialogProps {
  category: CategoryDto;
}

const EditCategoryDialog = ({ isOpen, closeDialog, category }: EditCategoryDialogProps) => {
  const { t } = useTranslation('categories');
  const { alertSuccess, alertError } = useSnackbar();
  const getCategoryName = useCategoryName();

  const methods = useForm<UpdateCategoryDTO>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: getCategoryName(category),
      type: category.type,
      color: category.color,
      icon: category.icon,
    },
    mode: 'all',
  });

  const updateCategory = useApiMutation<CategoryDto, UpdateCategoryDTO>({
    method: 'put',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const update = async (data: UpdateCategoryDTO) => {
    try {
      await updateCategory.mutateAsync(data);
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
