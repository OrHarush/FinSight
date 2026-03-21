import { BudgetFormSchema } from '@finsight/shared';
import { BudgetFormValues } from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { useCreateBudget, useCreateBudgetBulk } from '@/hooks/entities/useBudgetMutations';
import { useCategories } from '@/hooks/entities/useCategories';
import BudgetForm from '@/pages/Budgets/components/BudgetForm';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface CreateBudgetDialogProps extends BaseDialogProps {
  year: number;
  month: number;
}

const CreateBudgetDialog = ({ isOpen, closeDialog, year, month }: CreateBudgetDialogProps) => {
  const { t } = useTranslation('budgets');
  const { alertSuccess, alertError } = useSnackbar();
  const { categories } = useCategories();
  const createBudget = useCreateBudget();
  const createBudgetForRestOfYear = useCreateBudgetBulk();

  const methods = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetFormSchema),
    mode: 'all',
  });

  const createNewBudget = async (data: BudgetFormValues) => {
    const category = categories.find(c => c._id === data.category);

    if (!category) {
      return;
    }

    try {
      if (data.applyToRestOfYear) {
        await createBudgetForRestOfYear.mutateAsync({
          categoryId: category._id,
          year,
          startMonth: month + 1,
          endMonth: 12,
          limit: data.limit,
        });
        alertSuccess(t('messages.budgetSetForYear'));
      } else {
        await createBudget.mutateAsync({
          categoryId: category._id,
          year,
          month: month + 1,
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
        onSubmit={createNewBudget}
      >
        <BudgetForm showCategorySelect />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateBudgetDialog;
