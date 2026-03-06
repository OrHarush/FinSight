import { CreateCategoryCommand } from '@shared/types/CategoryCommands';
import { CreatePaymentMethodCommand } from '@shared/types/PaymentMethodCommands';
import { CreateAccountCommand } from '@shared/types/AccountCommands';

export const DEFAULT_CATEGORIES: CreateCategoryCommand[] = [
  // Income
  {
    key: 'salary',
    name: 'Salary',
    icon: 'AccountBalanceWallet',
    type: 'Income',
    color: '#4caf50',
  },
  {
    key: 'freelance',
    name: 'Freelance',
    icon: 'Work',
    type: 'Income',
    color: '#8bc34a',
  },
  {
    key: 'investments',
    name: 'Investments',
    icon: 'TrendingUp',
    type: 'Income',
    color: '#009688',
  },

  // Expenses
  {
    key: 'housing',
    name: 'Housing',
    icon: 'Home',
    type: 'Expense',
    color: '#673ab7',
  },
  {
    key: 'groceries',
    name: 'Groceries',
    icon: 'ShoppingCart',
    type: 'Expense',
    color: '#2196f3',
  },
  {
    key: 'transportation',
    name: 'Transportation',
    icon: 'DirectionsCar',
    type: 'Expense',
    color: '#03a9f4',
  },
  {
    key: 'utilities',
    name: 'Utilities',
    icon: 'Bolt',
    type: 'Expense',
    color: '#ffeb3b',
  },
  {
    key: 'dining_out',
    name: 'Dining Out',
    icon: 'Restaurant',
    type: 'Expense',
    color: '#ff5722',
  },
  {
    key: 'other',
    name: 'Other',
    icon: 'MoreHoriz',
    type: 'Expense',
    color: '#9e9e9e',
  },
];

export const DEFAULT_PAYMENT_METHODS: CreatePaymentMethodCommand[] = [
  {
    name: 'Credit Card',
    type: 'Credit',
    billingDay: 1,
    isPrimary: true,
  },
  {
    name: 'Bank Transfer',
    type: 'BankTransfer',
    isPrimary: false,
  },
];

export const DEFAULT_ACCOUNT: CreateAccountCommand = {
  name: 'Bank Balance',
  balance: 0,
  institution: 'Main Bank',
  accountNumber: '',
  isPrimary: true,
};
