import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

export interface ReviewFieldItem {
  id: string;
  txId: string;
}

export interface ReviewViewProps {
  fields: ReviewFieldItem[];
  categories: CategoryDto[];
  transactionById: Map<string, ReviewTransactionDto>;
}
