import { CategoryFormValues } from '@/types/Category';

export const mapCategoryFormToCommand = (values: CategoryFormValues) => ({
  name: values.name.trim(),
  type: values.type,
  color: values.color,
  icon: values.icon,
  monthlyLimit: values.monthlyLimit,
});
