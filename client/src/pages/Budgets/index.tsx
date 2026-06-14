import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePrimaryAction } from '@/components/shared/layout/PageHeaderContext';
import { useOpen } from '@/hooks/common/useOpen';
import BudgetDialogManager from '@/pages/Budgets/BudgetDialogManager';
import BudgetHeader from '@/pages/Budgets/BudgetHeader';
import BudgetsPageContent from '@/pages/Budgets/BudgetsPageContent';
import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';

const Budgets = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetDto | null>(null);
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [isEditDialogOpen, openEditDialog, closeEditDialogOpen] = useOpen();

  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month();

  const selectBudget = (category: CategoryDto, budget: BudgetDto) => {
    setSelectedCategory(category);
    setSelectedBudget(budget);
    openEditDialog();
  };

  const closeEditDialog = () => {
    closeEditDialogOpen();
    setSelectedCategory(null);
    setSelectedBudget(null);
  };

  usePrimaryAction(openCreateDialog);

  return (
    <PageLayout>
      <BudgetHeader
        date={selectedDate}
        onDateChange={setSelectedDate}
        onCreateBudget={openCreateDialog}
      />
      <BudgetsPageContent
        year={currentYear}
        month={currentMonth}
        onSetBudget={selectBudget}
        onCreateBudget={openCreateDialog}
      />
      <BudgetDialogManager
        selectedCategory={selectedCategory}
        selectedBudget={selectedBudget}
        isCreateOpen={isCreateDialogOpen}
        isEditOpen={isEditDialogOpen}
        year={currentYear}
        month={currentMonth}
        closeCreateDialog={closeCreateDialog}
        closeEditDialog={closeEditDialog}
      />
    </PageLayout>
  );
};

export default Budgets;
