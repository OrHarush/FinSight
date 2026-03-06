import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { BudgetDto } from '@/types/Budget';

export interface BudgetCategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  limit: number;
  percent: number;
}

export const calculateCategorySpent = (transactions: TransactionDto[]): Map<string, number> => {
  const map = new Map<string, number>();

  transactions.forEach(tx => {
    if (tx.category?.type === 'Expense') {
      const id = tx.category._id;
      map.set(id, (map.get(id) ?? 0) + tx.amount);
    }
  });

  return map;
};

export const transformAndSortCategoriesWithBudgets = (
  categories: CategoryDto[],
  spentMap: Map<string, number>,
  budgets: BudgetDto[]
): BudgetCategoryItem[] => {
  const budgetMap = new Map(budgets.map(b => [b.categoryId, b.limit]));

  return categories
    .filter(c => c.type === 'Expense' && budgetMap.has(c._id))
    .map(c => {
      const spent = spentMap.get(c._id) ?? 0;
      const limit = budgetMap.get(c._id)!;
      const percent = (spent / limit) * 100;

      return {
        id: c._id,
        name: c.name,
        icon: c.icon,
        color: c.color,
        spent,
        limit,
        percent,
      };
    })
    .sort((a, b) => b.percent - a.percent);
};
