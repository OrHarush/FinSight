import { useMemo } from 'react';

import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import {
  calculateCategorySpent,
  transformAndSortCategoriesWithBudgets,
} from '@/utils/entities/budget';

export const useSortedBudgetCategories = (
  categories: CategoryDto[],
  transactions: TransactionDto[],
  budgets: BudgetDto[]
) => {
  const getCategoryName = useCategoryName();

  return useMemo(() => {
    if (!categories || !transactions || !budgets) return [];

    const spentMap = calculateCategorySpent(transactions);
    return transformAndSortCategoriesWithBudgets(categories, spentMap, budgets, getCategoryName);
  }, [categories, transactions, budgets, getCategoryName]);
};
