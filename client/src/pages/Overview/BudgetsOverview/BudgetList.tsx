import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import BudgetProgressRow from '@/components/features/budgets/BudgetProgressRow';
import { BudgetCategoryItem } from '@/utils/budgetUtils';

interface BudgetListProps {
  budgets: BudgetCategoryItem[];
}

const BudgetList = ({ budgets }: BudgetListProps) => (
  <ScrollableColumn spacing={2} maxHeight={400}>
    {budgets.map(budget => (
      <BudgetProgressRow key={budget.id} budget={budget} />
    ))}
  </ScrollableColumn>
);

export default BudgetList;
