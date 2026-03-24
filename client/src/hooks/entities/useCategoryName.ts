import { useTranslation } from 'react-i18next';

import { CategoryDto } from '@/types/Category';
import { getCategoryDisplayName } from '@/utils/categoryUtils';

export const useCategoryName = () => {
  const { t } = useTranslation('categories');

  return (category: CategoryDto) => getCategoryDisplayName(category, t);
};
