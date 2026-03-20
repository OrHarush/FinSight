import type { CategoryType } from '@finsight/shared';

import { PresetColor } from '../../../shared/types/colors';
import { DefaultCategoryKey } from '../../../shared/types/defaultCategories';

export interface CategoryDto {
  _id: string;
  key?: DefaultCategoryKey;
  name: string;
  type: CategoryType;
  color: PresetColor;
  icon: string;
}
