import { FormProvider, useForm } from 'react-hook-form';
import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/entities/useCategories';
import { useCreateBudget, useCreateBudgetForRestOfYear } from '@/hooks/entities/useBudgetMutations';
import { BudgetFormValues } from '@/types/Budget';
import BudgetForm from '@/pages/Budgets/components/BudgetForm';

interface CreateBudgetDialogProps extends BaseDialogProps {
  year: number;
  month: number;
}

const CreateBudgetDialog = ({ isOpen, closeDialog, year, month }: CreateBudgetDialogProps) => {
  const { t } = useTranslation('budgets');
  const { alertSuccess, alertError } = useSnackbar();
  const { categories } = useCategories();

  const createBudget = useCreateBudget();
  const createBudgetForRestOfYear = useCreateBudgetForRestOfYear();

  const methods = useForm<BudgetFormValues>({
    defaultValues: {
      category: '',
      limit: 0,
      applyToRestOfYear: false,
    },
    mode: 'all',
  });

  const submitCreate = async (data: BudgetFormValues) => {
    console.log(categories);
    const category = categories.find(c => c._id === data.category);

    console.log('here');
    console.log(category);
    console.log(data);

    if (!category) {
      return;
    }

    try {
      if (data.applyToRestOfYear) {
        await createBudgetForRestOfYear.mutateAsync({
          categoryId: category._id,
          year,
          month,
          limit: data.limit,
        });
        alertSuccess(t('messages.budgetSetForYear'));
      } else {
        await createBudget.mutateAsync({
          categoryId: category._id,
          year,
          month,
          limit: data.limit,
        });
        alertSuccess(t('messages.budgetCreated'));
      }
    } catch {
      alertError(t('messages.budgetSaveFailed'));
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('createBudget')}
        onSubmit={submitCreate}
      >
        <BudgetForm showCategorySelect />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateBudgetDialog;
