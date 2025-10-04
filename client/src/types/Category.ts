import { CategoryType } from '../../../shared/types/CategoryCommands';

export interface CategoryFormValues {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  monthlyLimit?: number;
}

export interface CategoryDto {
  _id: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  monthlyLimit?: number;
}
