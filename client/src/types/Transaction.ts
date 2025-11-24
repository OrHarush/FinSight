import { AccountDto } from '@/types/Account';
import { CategoryDto } from '@/types/Category';
import { PaymentMethodDto } from '@/types/PaymentMethod';

export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export interface TransactionFormValues {
  name?: string;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  type: TransactionType;
  category?: string;
  paymentMethod?: string;
  account?: string;
  fromAccount?: string;
  toAccount?: string;
  userId?: string;
}

export interface TransactionDto {
  _id: string;
  name?: string;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  type: TransactionType;
  category?: CategoryDto;
  paymentMethod?: PaymentMethodDto;
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
