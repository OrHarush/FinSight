import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategoryDTO, CreateCategorySchema } from '@lyra/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import CategoryForm from '@/pages/Categories/components/CategoryForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto } from '@/types/Category';

const CreateCategoryDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('categories');
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CreateCategoryDTO>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { color: '#9ca3af' },
    mode: 'all',
  });

  const createCategory = useApiMutation<CategoryDto, CreateCategoryDTO>({
    method: 'post',
    url: API_ROUTES.CATEGORIES,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const createNewCategory = async (data: CreateCategoryDTO) => {
    try {
      await createCategory.mutateAsync(data);
      alertSuccess(t('messages.createSuccess'));
    } catch (err) {
      alertError(t('messages.createError'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.create')}
        onSubmit={createNewCategory}
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateCategoryDialog;
