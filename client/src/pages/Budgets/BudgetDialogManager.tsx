import CreateBudgetDialog from '@/pages/Budgets/components/dialogs/CreateBudgetDialog';
import EditBudgetDialog from '@/pages/Budgets/components/dialogs/EditBudgetDialog';
import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';

interface BudgetDialogManagerProps {
  selectedCategory: CategoryDto | null;
  selectedBudget: BudgetDto | null;
  isCreateOpen: boolean;
  isEditOpen: boolean;
  year: number;
  month: number;
  closeCreateDialog: () => void;
  closeEditDialog: () => void;
}

const BudgetDialogManager = ({
  selectedCategory,
  selectedBudget,
  isCreateOpen,
  isEditOpen,
  year,
  month,
  closeCreateDialog,
  closeEditDialog,
}: BudgetDialogManagerProps) => (
  <>
    {isCreateOpen && (
      <CreateBudgetDialog
        isOpen={isCreateOpen}
        closeDialog={closeCreateDialog}
        year={year}
        month={month}
      />
    )}
    {isEditOpen && selectedCategory && selectedBudget && (
      <EditBudgetDialog
        isOpen={isEditOpen}
        closeDialog={closeEditDialog}
        category={selectedCategory}
        budget={selectedBudget}
      />
    )}
  </>
);

export default BudgetDialogManager;
