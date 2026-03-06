import { useBudgets } from '@/hooks/entities/useBudgets';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useSortedBudgetCategories } from '@/hooks/business/useSortedBudgetCategories';
import { CategoryDto } from '@/types/Category';
import { BudgetDto } from '@/types/Budget';
import { computePreviousMonth, calculateCategorySpent } from '@/utils/budgetUtils';
import Column from '@/components/shared/layout/containers/Column';
import BudgetCard from '@/pages/Budgets/components/BudgetsList/BudgetCard';

interface BudgetsListProps {
  year: number;
  month: number;
  onSetBudget: (category: CategoryDto, budget: BudgetDto) => void;
}

const BudgetsList = ({ year, month, onSetBudget }: BudgetsListProps) => {
  const { categories } = useCategories();
  const { transactions } = useTransactions(year, month);
  const { budgets } = useBudgets(year, month);

  const { year: prevYear, month: prevMonth } = computePreviousMonth(year, month);
  const { budgets: prevBudgets } = useBudgets(prevYear, prevMonth);
  const { transactions: prevTransactions } = useTransactions(prevYear, prevMonth);

  const prevSpentMap = calculateCategorySpent(prevTransactions);
  const sortedBudgets = useSortedBudgetCategories(categories, transactions, budgets);

  return (
    <Column spacing={2}>
      {sortedBudgets.map(item => {
        const category = categories.find(c => c._id === item.id);
        const budget = budgets.find(b => b.categoryId === item.id);
        const prevBudget = prevBudgets.find(b => b.categoryId === item.id);
        const categoryTransactions = transactions.filter(tx => tx.category?._id === item.id);

        if (!category || !budget) {
          return null;
        }

        return (
          <BudgetCard
            key={item.id}
            category={category}
            spent={item.spent}
            budget={budget}
            prevBudget={prevBudget}
            prevSpent={prevSpentMap.get(item.id)}
            transactions={categoryTransactions}
            onEditBudget={() => onSetBudget(category, budget)}
          />
        );
      })}
    </Column>
  );
};

export default BudgetsList;
