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
  recurrence: 'None' | 'Monthly' | 'Yearly';
  startDate?: string;
  endDate?: string;
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
