import { useMemo } from 'react';
import { CategoryDto } from '@/types/Category';
import { BudgetDto } from '@/hooks/entities/useBudgets';
import { TransactionDto } from '@/types/Transaction';
import { calculateCategorySpent, transformAndSortCategoriesWithBudgets } from '@/utils/budgetUtils';

export const useSortedBudgetCategories = (
  categories: CategoryDto[],
  transactions: TransactionDto[],
  budgets: BudgetDto[]
) =>
  useMemo(() => {
    if (!categories || !transactions || !budgets) return [];

    const spentMap = calculateCategorySpent(transactions);
    return transformAndSortCategoriesWithBudgets(categories, spentMap, budgets);
  }, [categories, transactions, budgets]);
