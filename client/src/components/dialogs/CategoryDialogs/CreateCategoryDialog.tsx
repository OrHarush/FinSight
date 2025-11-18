import FormDialog from '@/components/dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { queryKeys } from '@/constants/queryKeys';
import CategoryForm from '@/components/dialogs/CategoryDialogs/CategoryForm';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateCategoryCommand } from '../../../../../shared/types/CategoryCommands';
import { mapCategoryFormToCommand } from '@/utils/categoryUtils';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';

const CreateCategoryDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('categories');
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CategoryFormValues>();
  // const methods = useForm<CategoryFormValues>({
  //   defaultValues: {
  //     type: 'Expense',
  //     color: '#4CAF50',
  //     icon: 'CategoryIcon',
  //     monthlyLimit: 0,
  //   },
  // });

  const createCategory = useApiMutation<CategoryDto, CreateCategoryCommand>({
    method: 'post',
    url: API_ROUTES.CATEGORIES,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const submitNewCategory = async (data: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync(mapCategoryFormToCommand(data));
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
        onSubmit={submitNewCategory}
      >
        <CategoryForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateCategoryDialog;
