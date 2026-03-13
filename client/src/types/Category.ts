import { CategoryType } from '../../../shared/types/CategoryCommands';
import { PresetColor } from '../../../shared/types/colors';
import { DefaultCategoryKey } from '../../../shared/types/defaultCategories';

export interface CategoryFormValues {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}

export interface CategoryDto {
  _id: string;
  key?: DefaultCategoryKey;
  name: string;
  type: CategoryType;
  color: PresetColor;
  icon: string;
}
