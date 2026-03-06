import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import BudgetsSkeleton from '@/pages/Budgets/components/BudgetsSkeleton';
import BudgetsList from '@/pages/Budgets/BudgetsList';
import CategoryIcon from '@mui/icons-material/Category';
import { CategoryDto } from '@/types/Category';

interface BudgetsPageContentProps {
  year: number;
  month: number;
  onSetBudget: (category: CategoryDto) => void;
}

const BudgetsPageContent = ({ year, month, onSetBudget }: BudgetsPageContentProps) => {
  const { categories, isLoading: isCategoriesLoading, error, refetch } = useCategories();
  const { isLoading: isTransactionsLoading } = useTransactions(year, month);

  const isLoading = isCategoriesLoading || isTransactionsLoading;

  if (error) {
    return <EntityError entityName={'categories'} refetch={refetch} />;
  }

  if (isLoading) {
    return <BudgetsSkeleton />;
  }

  const expenseCategories = categories.filter(cat => cat.type === 'Expense');

  if (!expenseCategories.length) {
    return <EntityEmpty entityName={'categories'} icon={CategoryIcon} />;
  }

  return <BudgetsList year={year} month={month} onSetBudget={onSetBudget} />;
};

export default BudgetsPageContent;
