import { useState } from 'react';
import { useOpen } from '@/hooks/common/useOpen';
import { CategoryDto } from '@/types/Category';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import BudgetHeader from '@/pages/Budgets/BudgetHeader';
import BudgetsPageContent from '@/pages/Budgets/BudgetsPageContent';
import BudgetDialogManager from '@/pages/Budgets/BudgetDialogManager';
import dayjs, { Dayjs } from 'dayjs';

const Budgets = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month();

  const handleOpenDialog = (category: CategoryDto) => {
    setSelectedCategory(category);
    openDialog();
  };

  const handleCloseDialog = () => {
    closeDialog();
    setSelectedCategory(null);
  };

  return (
    <PageLayout>
      <BudgetHeader date={selectedDate} onDateChange={setSelectedDate} />
      <BudgetsPageContent year={currentYear} month={currentMonth} onSetBudget={handleOpenDialog} />
      <BudgetDialogManager
        selectedCategory={selectedCategory}
        isOpen={isDialogOpen}
        year={currentYear}
        month={currentMonth}
        onClose={handleCloseDialog}
      />
    </PageLayout>
  );
};

export default Budgets;
