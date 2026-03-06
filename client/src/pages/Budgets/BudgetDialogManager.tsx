import { useTranslation } from 'react-i18next';
import {
  useCreateBudget,
  useUpdateBudget,
  useCreateBudgetForRestOfYear,
} from '@/hooks/entities/useBudgetMutations';
import { useBudgets } from '@/hooks/entities/useBudgets';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto } from '@/types/Category';
import BudgetDialog from '@/pages/Budgets/components/BudgetDialog';

interface BudgetDialogManagerProps {
  selectedCategory: CategoryDto | null;
  isOpen: boolean;
  year: number;
  month: number;
  onClose: () => void;
}

const BudgetDialogManager = ({
  selectedCategory,
  isOpen,
  year,
  month,
  onClose,
}: BudgetDialogManagerProps) => {
  const { t } = useTranslation('budget');
  const { alertSuccess, alertError } = useSnackbar();
  const { budgets } = useBudgets(year, month);

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const createBudgetForRestOfYear = useCreateBudgetForRestOfYear();

  const handleSaveBudget = async (limit: number, applyToRestOfYear: boolean) => {
    if (!selectedCategory) return;

    try {
      const existingBudget = budgets.find(b => b.categoryId === selectedCategory._id);

      if (existingBudget) {
        await updateBudget.mutateAsync({
          budgetId: existingBudget._id,
          limit,
        });
        alertSuccess(t('messages.budgetUpdated'));
      } else {
        if (applyToRestOfYear) {
          await createBudgetForRestOfYear.mutateAsync({
            categoryId: selectedCategory._id,
            year,
            month,
            limit,
          });
          alertSuccess(t('messages.budgetSetForYear'));
        } else {
          await createBudget.mutateAsync({
            categoryId: selectedCategory._id,
            year,
            month,
            limit,
          });
          alertSuccess(t('messages.budgetCreated'));
        }
      }
      onClose();
    } catch {
      alertError(t('messages.budgetSaveFailed'));
    }
  };

  if (!selectedCategory) {
    return null;
  }

  const existingLimit = budgets.find(b => b.categoryId === selectedCategory._id)?.limit;

  return (
    <BudgetDialog
      isOpen={isOpen}
      closeDialog={onClose}
      category={selectedCategory}
      year={year}
      month={month}
      existingLimit={existingLimit}
      onSave={handleSaveBudget}
    />
  );
};

export default BudgetDialogManager;
