import SavingsIcon from '@mui/icons-material/Savings';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import { useBudgets } from '@/hooks/entities/useBudgets';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import BudgetsList from '@/pages/Budgets/components/BudgetsList';
import BudgetsSkeleton from '@/pages/Budgets/components/BudgetsSkeleton';
import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';

interface BudgetsPageContentProps {
  year: number;
  month: number;
  onSetBudget: (category: CategoryDto, budget: BudgetDto) => void;
  onCreateBudget: () => void;
}

const BudgetsPageContent = ({ year, month, onSetBudget }: BudgetsPageContentProps) => {
  const { isLoading: isCategoriesLoading, error, refetch } = useCategories();
  const { isLoading: isTransactionsLoading } = useTransactions(year, month);
  const { budgets, isLoading: isBudgetsLoading } = useBudgets(year, month);

  const isLoading = isCategoriesLoading || isTransactionsLoading || isBudgetsLoading;

  if (error) {
    return <EntityError entityName={'categories'} refetch={refetch} />;
  }

  if (isLoading) {
    return <BudgetsSkeleton />;
  }

  if (!budgets.length) {
    return <EntityEmpty entityName={'budgets'} icon={SavingsIcon} />;
  }

  return <BudgetsList year={year} month={month} onSetBudget={onSetBudget} />;
};

export default BudgetsPageContent;
