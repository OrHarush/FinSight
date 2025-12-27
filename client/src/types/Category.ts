import { CategoryType } from '../../../shared/types/CategoryCommands';
import { PresetColor } from '../../../shared/types/colors';

export interface CategoryFormValues {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  monthlyLimit?: number;
}

export interface CategoryDto {
  _id: string;
  key?: DecompressionStream;
  name: string;
  type: CategoryType;
  color: PresetColor;
  icon: string;
  monthlyLimit?: number;
}
