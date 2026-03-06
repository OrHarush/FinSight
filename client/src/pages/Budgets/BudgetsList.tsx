import { useBudgets } from '@/hooks/entities/useBudgets';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useSortedBudgetCategories } from '@/hooks/business/useSortedBudgetCategories';
import { CategoryDto } from '@/types/Category';
import { BudgetDto } from '@/types/Budget';
import Column from '@/components/shared/layout/containers/Column';
import BudgetCategoryRow from '@/pages/Budgets/components/BudgetCategoryRow';

interface BudgetsListProps {
  year: number;
  month: number;
  onSetBudget: (category: CategoryDto, budget: BudgetDto) => void;
}

const BudgetsList = ({ year, month, onSetBudget }: BudgetsListProps) => {
  const { categories } = useCategories();
  const { transactions } = useTransactions(year, month);
  const { budgets } = useBudgets(year, month);

  const sortedBudgets = useSortedBudgetCategories(categories, transactions, budgets);

  return (
    <Column spacing={2}>
      {sortedBudgets.map(item => {
        const category = categories.find(c => c._id === item.id);
        const budget = budgets.find(b => b.categoryId === item.id);
        const categoryTransactions = transactions.filter(tx => tx.category?._id === item.id);

        if (!category || !budget) {
          return null;
        }

        return (
          <BudgetCategoryRow
            key={item.id}
            category={category}
            spent={item.spent}
            budget={budget}
            transactions={categoryTransactions}
            onEditBudget={() => onSetBudget(category, budget)}
          />
        );
      })}
    </Column>
  );
};

export default BudgetsList;
