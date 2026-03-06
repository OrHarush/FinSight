import { FormProvider, useForm } from 'react-hook-form';
import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import { useUpdateBudget } from '@/hooks/entities/useBudgetMutations';
import { BudgetDto, BudgetFormValues } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';
import BudgetForm from '@/pages/Budgets/components/BudgetForm';

interface EditBudgetDialogProps extends BaseDialogProps {
  category: CategoryDto;
  budget: BudgetDto;
}

const EditBudgetDialog = ({ isOpen, closeDialog, category, budget }: EditBudgetDialogProps) => {
  const { t } = useTranslation('budget');
  const { alertSuccess, alertError } = useSnackbar();
  const updateBudget = useUpdateBudget();

  const methods = useForm<BudgetFormValues>({
    defaultValues: {
      category: category._id,
      limit: budget.limit,
      applyToRestOfYear: false,
    },
    mode: 'all',
  });

  const submitUpdate = async (data: BudgetFormValues) => {
    try {
      await updateBudget.mutateAsync({ budgetId: budget._id, limit: data.limit });
      alertSuccess(t('messages.budgetUpdated'));
    } catch {
      alertError(t('messages.budgetSaveFailed'));
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={`${t('dialog.editTitle')} - ${category.name}`}
        onSubmit={submitUpdate}
        isUpdateForm
      >
        <BudgetForm isEditing />
      </FormDialog>
    </FormProvider>
  );
};

export default EditBudgetDialog;
