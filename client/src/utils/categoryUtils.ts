import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { PresetColor } from '../../../shared/types/colors';
import { CreateCategoryCommand } from '../../../shared/types/CategoryCommands';
import i18n, { TFunction } from 'i18next';

export const mapCategoryFormToCommand = (values: CategoryFormValues): CreateCategoryCommand => ({
  name: values.name.trim(),
  type: values.type,
  icon: values.icon,
  color: (values.color as PresetColor) || '#9ca3af',
});

export const getTopSpendingCategories = (
  transactions: TransactionDto[],
  categories: CategoryDto[],
  limit = 5
) => {
  const perCategory = new Map<string, number>();

  for (const tx of transactions) {
    if (!tx.category || tx.category.type !== 'Expense') continue;

    const id = tx.category._id;
    perCategory.set(id, (perCategory.get(id) ?? 0) + tx.amount);
  }

  return categories
    .filter(category => category.type === 'Expense' && perCategory.has(category._id))
    .map(category => ({
      id: category._id,
      key: category.key,
      name: category.name,
      amount: perCategory.get(category._id) ?? 0,
      color: category.color,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

export const getCategoryDisplayName = (
  category: Pick<CategoryDto, 'name' | 'key'>,
  t: TFunction<'categories'>
) => {
  if (!category.key) {
    return category.name;
  }

  const defaultName = i18n.getFixedT('en', 'categories')(`defaults.${category.key}`);

  if (category.name !== defaultName) {
    return category.name;
  }

  return t(`defaults.${category.key}`);
};
