import i18n, { TFunction } from 'i18next';

import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';

type PresetCategoryRules = {
  type: 'Income' | 'Expense';
  categoryKey?: string;
  nameTerms: string[];
};

const PRESET_CATEGORY_CONFIG: Record<string, PresetCategoryRules> = {
  salary: {
    type: 'Income',
    categoryKey: 'salary',
    nameTerms: ['salary', 'משכורת'],
  },
  rent: {
    type: 'Expense',
    categoryKey: 'housing',
    nameTerms: ['rent', 'housing', 'דיור', 'שכירות'],
  },
  coffee: {
    type: 'Expense',
    categoryKey: 'dining_out',
    nameTerms: ['dining', 'eating', 'coffee', 'קפה', 'אוכל בחוץ'],
  },
  bit: {
    type: 'Expense',
    categoryKey: 'entertainment',
    nameTerms: ['entertainment', 'going out', 'בילוי', 'בילויים'],
  },
};

export const resolvePresetCategory = (
  presetKey: string,
  categories: CategoryDto[]
): string | undefined => {
  const config = PRESET_CATEGORY_CONFIG[presetKey];

  if (!config) {
    return undefined;
  }

  if (config.categoryKey) {
    const byKey = categories.find(
      c => c.key === config.categoryKey && c.type === config.type
    );

    if (byKey) {
      return byKey._id;
    }
  }

  const byName = categories.find(
    c =>
      c.type === config.type &&
      config.nameTerms.some(term => c.name.toLowerCase().includes(term.toLowerCase()))
  );

  return byName?._id;
};

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
  category: Pick<CategoryDto, 'name' | 'key'> | null | undefined,
  t: TFunction<'categories'>
) => {
  if (!category) {
    return t('uncategorized');
  }

  if (!category.key) {
    return category.name;
  }

  const defaultName = i18n.getFixedT('en', 'categories')(`defaults.${category.key}`);

  if (category.name !== defaultName) {
    return category.name;
  }

  return t(`defaults.${category.key}`);
};
