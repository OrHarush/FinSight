import { CategoryDto } from '@/types/CategoryDto';
import { AccountDto } from '@/types/Account';

export enum TransactionType {
  Expense = 'Expense',
  Income = 'Income',
}

export interface TransactionFormValues {
  name: string;
  amount: number;
  date: string;
  endDate?: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: string;
  account: string;
}

export interface TransactionDto {
  _id: string;
  name: string;
  amount: number;
  date: string;
  endDate?: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: CategoryDto;
  account: AccountDto;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedTransaction extends TransactionDto {
  originalId: string;
}
