import type { CategoryType, DefaultCategoryKey, PresetColor } from '@finsight/shared';

export interface CategoryDto {
  _id: string;
  key?: DefaultCategoryKey;
  name: string;
  type: CategoryType;
  color: PresetColor;
  icon: string;
}
