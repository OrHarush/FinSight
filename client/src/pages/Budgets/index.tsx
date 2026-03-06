import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useBudgets } from '@/hooks/entities/useBudgets';
import {
  useCreateBudget,
  useUpdateBudget,
  useCreateBudgetForRestOfYear,
} from '@/hooks/entities/useBudgetMutations';
import { useOpen } from '@/hooks/useOpen';
import { TransactionDto } from '@/types/Transaction';
import { CategoryDto } from '@/types/Category';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import BudgetHeader from '@/pages/Budgets/BudgetHeader';
import BudgetCategoryRow from '@/pages/Budgets/BudgetCategoryRow';
import BudgetsSkeleton from '@/pages/Budgets/BudgetsSkeleton';
import BudgetDialog from '@/pages/Budgets/BudgetDialog';
import dayjs, { Dayjs } from 'dayjs';
import Column from '@/components/shared/layout/containers/Column';
import { useSnackbar } from '@/providers/SnackbarProvider';

const calculateCategorySpent = (transactions: TransactionDto[]): Map<string, number> => {
  const map = new Map<string, number>();

  transactions.forEach(tx => {
    if (tx.category?.type === 'Expense') {
      const id = tx.category._id;
      map.set(id, (map.get(id) ?? 0) + tx.amount);
    }
  });

  return map;
};

const Budgets = () => {
  const { t } = useTranslation('budget');
  const { alertSuccess, alertError } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month();

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(
    currentYear,
    currentMonth
  );
  const { budgets } = useBudgets(currentYear, currentMonth);

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const createBudgetForRestOfYear = useCreateBudgetForRestOfYear();

  const perCategorySpent = useMemo(() => calculateCategorySpent(transactions), [transactions]);

  const expenseCategories = useMemo(
    () => categories.filter(cat => cat.type === 'Expense'),
    [categories]
  );

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  const handleOpenDialog = (category: CategoryDto) => {
    setSelectedCategory(category);
    openDialog();
  };

  const handleCloseDialog = () => {
    closeDialog();
    setSelectedCategory(null);
  };

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
            year: currentYear,
            month: currentMonth,
            limit,
          });
          alertSuccess(t('messages.budgetSetForYear'));
        } else {
          await createBudget.mutateAsync({
            categoryId: selectedCategory._id,
            year: currentYear,
            month: currentMonth,
            limit,
          });
          alertSuccess(t('messages.budgetCreated'));
        }
      }
      handleCloseDialog();
    } catch {
      alertError(t('messages.budgetSaveFailed'));
    }
  };

  return (
    <PageLayout>
      <BudgetHeader date={selectedDate} onDateChange={setSelectedDate} />

      <Column spacing={2}>
        {isLoading ? (
          <BudgetsSkeleton />
        ) : expenseCategories.length === 0 ? (
          <div>{t('categories.empty')}</div>
        ) : (
          expenseCategories.map(category => {
            const spent = perCategorySpent.get(category._id) || 0;
            const budget = budgets.find(b => b.categoryId === category._id);

            return (
              <BudgetCategoryRow
                key={category._id}
                category={category}
                spent={spent}
                budget={budget}
                transactions={transactions}
                year={currentYear}
                month={currentMonth}
                onSetBudget={() => handleOpenDialog(category)}
              />
            );
          })
        )}
      </Column>
      {selectedCategory && (
        <BudgetDialog
          isOpen={isDialogOpen}
          closeDialog={handleCloseDialog}
          category={selectedCategory}
          year={currentYear}
          month={currentMonth}
          existingLimit={budgets.find(b => b.categoryId === selectedCategory._id)?.limit}
          onSave={handleSaveBudget}
        />
      )}
    </PageLayout>
  );
};

export default Budgets;
