import type { CategoryType, DefaultCategoryKey, PresetColor } from '@lyra/shared';

export interface CategoryDto {
  _id: string;
  key?: DefaultCategoryKey;
  name: string;
  type: CategoryType;
  color: PresetColor;
  icon: string;
  usageCount?: number;
  isFrequent?: boolean;
}
