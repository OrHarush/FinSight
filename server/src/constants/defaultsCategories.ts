import { CreateCategoryCommand } from '@shared/types/CategoryCommands';

export const DEFAULT_CATEGORIES: CreateCategoryCommand[] = [
  // Income
  {
    name: 'Salary',
    icon: 'AccountBalanceWallet',
    type: 'Income',
    color: '#22c55e',
  },
  {
    name: 'Freelance',
    icon: 'Work',
    type: 'Income',
    color: '#10b981',
  },
  {
    name: 'Investments',
    icon: 'TrendingUp',
    type: 'Income',
    color: '#14b8a6',
  },

  // Expenses
  {
    name: 'Housing',
    icon: 'Home',
    type: 'Expense',
    color: '#8b5cf6',
  },
  {
    name: 'Groceries',
    icon: 'ShoppingCart',
    type: 'Expense',
    color: '#3b82f6',
  },
  {
    name: 'Transportation',
    icon: 'DirectionsCar',
    type: 'Expense',
    color: '#0ea5e9',
  },
  {
    name: 'Utilities',
    icon: 'Bolt',
    type: 'Expense',
    color: '#06b6d4',
  },
  {
    name: 'Healthcare',
    icon: 'LocalHospital',
    type: 'Expense',
    color: '#ec4899',
  },
  {
    name: 'Dining Out',
    icon: 'Restaurant',
    type: 'Expense',
    color: '#f43f5e',
  },
  {
    name: 'Shopping',
    icon: 'ShoppingBag',
    type: 'Expense',
    color: '#a855f7',
  },
  {
    name: 'Entertainment',
    icon: 'Movie',
    type: 'Expense',
    color: '#f97316',
  },
  {
    name: 'Travel',
    icon: 'Flight',
    type: 'Expense',
    color: '#14b8a6',
  },
  {
    name: 'Other',
    icon: 'MoreHoriz',
    type: 'Expense',
    color: '#94a3b8',
  },
];
