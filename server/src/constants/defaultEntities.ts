import { CreateAccountDTO, CreateCategoryDTO, CreatePaymentMethodDTO } from '@lyra/shared';

export const DEFAULT_CATEGORIES: CreateCategoryDTO[] = [
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
    key: 'utilities',
    name: 'Utilities',
    icon: 'Bolt',
    type: 'Expense',
    color: '#ffeb3b',
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
    key: 'dining_out',
    name: 'Dining Out',
    icon: 'Restaurant',
    type: 'Expense',
    color: '#ff5722',
  },
  {
    key: 'entertainment',
    name: 'Entertainment',
    icon: 'LocalMovies',
    type: 'Expense',
    color: '#e91e63',
  },
  {
    key: 'health',
    name: 'Health',
    icon: 'MedicalServices',
    type: 'Expense',
    color: '#f44336',
  },
  {
    key: 'subscriptions',
    name: 'Subscriptions',
    icon: 'Subscriptions',
    type: 'Expense',
    color: '#9c27b0',
  },
  {
    key: 'insurance',
    name: 'Insurance',
    icon: 'HealthAndSafety',
    type: 'Expense',
    color: '#795548',
  },
];

export const DEFAULT_PAYMENT_METHODS: CreatePaymentMethodDTO[] = [
  {
    key: 'credit_card',
    name: 'Credit Card',
    type: 'Credit Card',
    billingDay: 1,
    isPrimary: true,
  },
  {
    key: 'immediate_debit',
    name: 'Immediate Debit',
    type: 'Bank Transfer',
    isPrimary: false,
  },
];

export const DEFAULT_ACCOUNT: CreateAccountDTO = {
  key: 'checking_account',
  name: 'Checking Account',
  balance: 0,
  institution: 'Main Bank',
  accountNumber: undefined,
  isPrimary: true,
};
