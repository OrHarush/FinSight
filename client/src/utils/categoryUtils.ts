import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';

export const mapCategoryFormToCommand = (values: CategoryFormValues) => ({
  name: values.name.trim(),
  type: values.type,
  color: values.color,
  icon: values.icon,
  monthlyLimit: values.monthlyLimit,
});

export function getTopSpendingCategories(
  transactions: TransactionDto[],
  categories: CategoryDto[],
  limit = 5
) {
  const perCategory = new Map<string, number>();

  for (const tx of transactions) {
    if (!tx.category || tx.category.type !== 'Expense') continue;

    const id = tx.category._id;
    perCategory.set(id, (perCategory.get(id) ?? 0) + tx.amount);
  }

  return categories
    .filter(cat => cat.type === 'Expense' && perCategory.has(cat._id))
    .map(cat => ({
      id: cat._id,
      name: cat.name,
      amount: perCategory.get(cat._id) ?? 0,
      color: cat.color,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
