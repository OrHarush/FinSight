import {
  CreateRecurringTemplateDTO,
  CreateTransactionDTO,
  SplitRecurringTemplateDTO,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@lyra/shared';

import {
  ExpandedTransactionDto,
  SortableColumn,
  SortOrder,
  TransactionDto,
} from '@/types/Transaction';
import { PAYMENT_TYPE_LOCALE_KEY } from '@/utils/entities/paymentMethod';

const buildTransactionPayload = (data: TransactionFormValues) => {
  const base = {
    amount: Number(data.amount),
    date: data.date ? new Date(data.date).toISOString() : undefined,
    type: data.type,
    belongToPreviousMonth: data.belongToPreviousMonth,
    paymentMethodId: data.paymentMethod,
    note: data.note || undefined,
  };

  if (data.type === 'Expense' || data.type === 'Income') {
    return { ...base, name: data.name, categoryId: data.category, accountId: data.account };
  }

  return { ...base, fromAccountId: data.fromAccount, toAccountId: data.toAccount };
};

export const mapToCreatePayload = (data: TransactionFormValues): CreateTransactionDTO =>
  buildTransactionPayload(data);

export const mapToUpdatePayload = (data: TransactionFormValues): UpdateTransactionDTO =>
  buildTransactionPayload(data);

export const mapToTemplateChangesPayload = (
  data: TransactionFormValues,
  fromDate: string
): SplitRecurringTemplateDTO => {
  const base = {
    fromDate,
    amount: Number(data.amount),
    type: data.type,
    belongToPreviousMonth: data.belongToPreviousMonth,
    paymentMethodId: data.paymentMethod,
    note: data.note || undefined,
  };

  if (data.type === 'Expense' || data.type === 'Income') {
    return { ...base, name: data.name, categoryId: data.category, accountId: data.account };
  }

  return { ...base, fromAccountId: data.fromAccount, toAccountId: data.toAccount };
};

export const mapToRecurringTemplatePayload = (
  data: TransactionFormValues
): CreateRecurringTemplateDTO => {
  const base = {
    frequency: data.recurrence as 'Monthly' | 'Yearly',
    dayOfMonth: new Date(data.startDate!).getDate(),
    startDate: data.startDate!,
    endDate: data.endDate,
    type: data.type,
    amount: Number(data.amount),
    belongToPreviousMonth: data.belongToPreviousMonth,
    paymentMethodId: data.paymentMethod,
    note: data.note || undefined,
  };

  if (data.type === 'Expense' || data.type === 'Income') {
    return { ...base, name: data.name, categoryId: data.category, accountId: data.account };
  }

  return { ...base, fromAccountId: data.fromAccount, toAccountId: data.toAccount };
};

export const getTransactionDisplayDate = (tx: ExpandedTransactionDto) => tx.date ?? '';

const getSortValue = (tx: ExpandedTransactionDto, column: SortableColumn): string | number => {
  switch (column) {
    case 'name':
      return tx.name?.toLowerCase() ?? '';
    case 'amount':
      return tx.amount;
    case 'category':
      return tx.category?.name?.toLowerCase() ?? '';
    case 'account':
      return tx.account?.name?.toLowerCase() ?? '';
    case 'paymentMethod':
      return (
        tx.paymentMethod?.name ||
        PAYMENT_TYPE_LOCALE_KEY[tx.paymentMethod?.type] ||
        ''
      ).toLowerCase();
    case 'date':
      return tx.date ?? '';
  }
};

export const compareTransactions = (
  a: TransactionDto,
  b: TransactionDto,
  order: SortOrder,
  orderBy: SortableColumn
): number => {
  const aVal = getSortValue(a, orderBy);
  const bVal = getSortValue(b, orderBy);

  if (aVal < bVal) {
    return order === 'asc' ? -1 : 1;
  }

  if (aVal > bVal) {
    return order === 'asc' ? 1 : -1;
  }

  return 0;
};

export const splitExpenses = (
  transactions: TransactionDto[],
  accountId: string
): { fixedExpenses: number; variableExpenses: number } => {
  let fixedExpenses = 0;
  let variableExpenses = 0;

  for (const tx of transactions) {
    if (tx.account?._id !== accountId) {
      continue;
    }

    if (tx.type !== 'Expense') {
      continue;
    }

    const abs = Math.abs(tx.amount);

    if (tx.frequency) {
      fixedExpenses += abs;
    } else {
      variableExpenses += abs;
    }
  }

  return { fixedExpenses, variableExpenses };
};

export const countUniqueSpendingDays = (
  transactions: TransactionDto[],
  accountId: string
): number => {
  const days = new Set<string>();

  for (const tx of transactions) {
    if (tx.account?._id !== accountId) continue;
    if (tx.type !== 'Expense') continue;
    if (tx.frequency) continue;
    if (!tx.date) continue;

    days.add(new Date(tx.date).toISOString().slice(0, 10));
  }

  return days.size;
};

const sumExpensesPerDay = (
  transactions: TransactionDto[],
  accountId: string
): Map<number, number> => {
  const totals = new Map<number, number>();

  for (const tx of transactions) {
    if (tx.account?._id !== accountId) continue;
    if (tx.type !== 'Expense') continue;
    if (tx.frequency) continue;
    if (!tx.date) continue;

    const dayOfMonth = new Date(tx.date).getDate();
    const previous = totals.get(dayOfMonth) ?? 0;
    totals.set(dayOfMonth, previous + Math.abs(tx.amount));
  }

  return totals;
};

export const findMostExpensiveDay = (
  transactions: TransactionDto[],
  accountId: string
): { day: number; amount: number } | null => {
  const totals = sumExpensesPerDay(transactions, accountId);

  if (totals.size === 0) {
    return null;
  }

  let topDay = 0;
  let topAmount = -Infinity;

  for (const [day, amount] of totals) {
    if (amount > topAmount) {
      topDay = day;
      topAmount = amount;
    }
  }

  return { day: topDay, amount: topAmount };
};

export const countSpendFreeDays = (
  transactions: TransactionDto[],
  accountId: string,
  daysInMonth: number
): number => {
  const totals = sumExpensesPerDay(transactions, accountId);

  return Math.max(daysInMonth - totals.size, 0);
};
