import type { TransactionType } from '@finsight/shared';

import { AccountDto } from '@/types/Account';
import { CategoryDto } from '@/types/Category';
import { PaymentMethodDto } from '@/types/PaymentMethod';

export interface TransactionPageFormValues {
  searchValue: string;
  category: string;
  paymentMethod: string;
}

export interface TransactionDto {
  _id: string;
  name: string;
  type: TransactionType;
  amount: number;
  date?: string;
  frequency?: 'Monthly' | 'Yearly';
  templateId?: string;
  belongToPreviousMonth?: boolean;
  category: CategoryDto;
  paymentMethod: PaymentMethodDto;
  account?: AccountDto;
  fromAccount?: AccountDto;
  toAccount?: AccountDto;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummaryDto {
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface ExpandedTransactionDto extends TransactionDto {
  originalId?: string;
}

export type SortOrder = 'asc' | 'desc';

export type SortableColumn = 'name' | 'amount' | 'category' | 'account' | 'paymentMethod' | 'date';
