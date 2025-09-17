import { CategoryDto } from '@/types/CategoryDto';

export enum TransactionType {
  Expense = 'Expense',
  Income = 'Income',
}

export interface TransactionFormValues {
  name: string;
  date: string;
  amount: string;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: string;
  accountRelated: string;
}

export interface TransactionDto {
  _id: string;
  name: string;
  date: string;
  amount: number;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: CategoryDto;
  accountRelated: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
