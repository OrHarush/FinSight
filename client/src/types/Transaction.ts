import { AccountDto } from '@/types/Account';
import { CategoryDto } from '@/types/Category';
import { PaymentMethodDto } from '@/types/PaymentMethod';

export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export interface TransactionPageFormValues {
  searchValue: string;
  category: string;
  paymentMethod: string;
}

export interface TransactionFormValues {
  name?: string;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  belongToPreviousMonth: boolean;
  type: TransactionType;
  category?: string;
  paymentMethod?: string;
  account?: string;
  fromAccount?: string;
  toAccount?: string;
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
  category?: CategoryDto;
  paymentMethod?: PaymentMethodDto;
  account?: AccountDto;
  fromAccount?: AccountDto;
  toAccount?: AccountDto;
}

export interface TransactionSummaryDto {
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface ExpandedTransactionDto extends TransactionDto {
  originalId?: string;
}
