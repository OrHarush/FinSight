import { CategoryDto, CategoryFormValues } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { PRESET_COLORS, PresetColor } from '../../../shared/types/colors';
import { CreateCategoryCommand } from '../../../shared/types/CategoryCommands';
import { DefaultCategoryKey } from '../../../shared/types/defaultCategories';
import { TFunction } from 'i18next';

export function mapCategoryFormToCommand(values: CategoryFormValues): CreateCategoryCommand {
  if (!PRESET_COLORS.includes(values.color as PresetColor)) {
    throw new Error(`Invalid category color: ${values.color}`);
  }

  return {
    name: values.name.trim(),
    type: values.type,
    icon: values.icon,
    color: values.color as PresetColor,
    monthlyLimit: values.monthlyLimit,
  };
}

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
}

export function getCategoryDisplayName(
  category: { name: string; key?: DefaultCategoryKey },
  t: TFunction<'categories'>
): string {
  if (category.key) {
    return t(`defaults.${category.key}`);
  }

  return category.name;
}
