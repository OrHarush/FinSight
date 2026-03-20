import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { useUpdateBudget } from '@/hooks/entities/useBudgetMutations';
import BudgetForm from '@/pages/Budgets/components/BudgetForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { BudgetFormValues } from '@finsight/shared';
import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';

interface EditBudgetDialogProps extends BaseDialogProps {
  category: CategoryDto;
  budget: BudgetDto;
}

const EditBudgetDialog = ({ isOpen, closeDialog, category, budget }: EditBudgetDialogProps) => {
  const { t } = useTranslation('budgets');
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
