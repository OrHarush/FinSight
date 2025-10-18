import { CreateCategoryCommand } from '@shared/types/CategoryCommands';

export const DEFAULT_CATEGORIES: CreateCategoryCommand[] = [
  // Income Categories
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
  {
    name: 'Rent',
    icon: 'Home',
    type: 'Expense',
    color: '#8b5cf6',
  },
  {
    name: 'Groceries & Utilities',
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
    name: 'Healthcare',
    icon: 'LocalHospital',
    type: 'Expense',
    color: '#ec4899',
  },
  {
    name: 'Dates',
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
    name: 'Subscriptions',
    icon: 'Subscriptions',
    type: 'Expense',
    color: '#6366f1',
  },
  {
    name: 'Loan',
    icon: 'AccountBalance',
    type: 'Expense',
    color: '#ef4444',
  },
  {
    name: 'Education',
    icon: 'School',
    type: 'Expense',
    color: '#84cc16',
  },
  {
    name: 'Gifts',
    icon: 'CardGiftcard',
    type: 'Expense',
    color: '#ec4899',
  },
  {
    name: 'Household',
    icon: 'Cottage',
    type: 'Expense',
    color: '#64748b',
  },
  {
    name: 'Travel',
    icon: 'Flight',
    type: 'Expense',
    color: '#06b6d4',
  },
  {
    name: 'Miscellaneous',
    icon: 'MoreHoriz',
    type: 'Expense',
    color: '#94a3b8',
  },
];
