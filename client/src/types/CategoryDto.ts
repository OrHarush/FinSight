import { TransactionType } from '@/types/Transaction';

export interface CategoryFormValues {
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface CategoryDto {
  _id: string;
  name: string;
  type: string;
  color: string;
  icon?: string;
  monthlyLimit?: number;
}
