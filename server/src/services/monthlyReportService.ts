import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { fromCents } from '@lyra/shared';

import { ICategory } from '../models/Category';
import * as budgetRepository from '../repositories/budgetRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as userRepository from '../repositories/userRepository';
import { ITransactionPopulated } from '../types/Transaction';
import { getTransactionSummary } from './transactions/transactionService';

dayjs.extend(utc);

export interface CategorySummary {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  budget: number | null;
}

export interface MonthlyReportSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  daysInMonth: number;
  savingsRate: number;
  topCategories: CategorySummary[];
}

interface MonthlyReportEligibilityResult {
  shouldShow: false;
}

interface MonthlyReportEligibleResult {
  shouldShow: true;
  month: string;
  summary: MonthlyReportSummary;
}

type EligibilityResult = MonthlyReportEligibilityResult | MonthlyReportEligibleResult;

const groupExpensesByCategory = (
  transactions: ITransactionPopulated[]
): { category: ICategory; totalCents: number }[] => {
  const map = new Map<string, { category: ICategory; totalCents: number }>();

  for (const tx of transactions) {
    if (tx.type !== 'Expense' || !tx.category) {
      continue;
    }

    const cat = tx.category as ICategory;
    const key = cat._id.toString();
    const existing = map.get(key);

    if (existing) {
      existing.totalCents += tx.amount;
    } else {
      map.set(key, { category: cat, totalCents: tx.amount });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalCents - a.totalCents);
};

export const getEligibility = async (
  userId: string,
  workspaceId: string,
  month: string
): Promise<EligibilityResult> => {
  const user = await userRepository.findById(userId);

  if (!user || user.lastMonthlyReportSeenMonth === month) {
    return { shouldShow: false };
  }

  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthOneBased = parseInt(monthStr, 10);
  const from = new Date(Date.UTC(year, monthOneBased - 1, 1));
  const to = new Date(Date.UTC(year, monthOneBased, 1));

  const transactions = await transactionRepository.findMany(workspaceId, { from, to });

  if (transactions.length === 0) {
    return { shouldShow: false };
  }

  const summaryResult = await getTransactionSummary(workspaceId, {
    year,
    month: monthOneBased - 1,
    accountId: undefined,
    from: undefined,
  });

  const { monthlyIncome, monthlyExpenses } = summaryResult as {
    monthlyIncome: number;
    monthlyExpenses: number;
  };

  const budgets = await budgetRepository.findMany(workspaceId, {
    year,
    month: monthOneBased - 1,
  });
  const budgetMap = new Map(budgets.map(b => [b.categoryId.toString(), b.limit]));

  const grouped = groupExpensesByCategory(transactions);
  const topCategories: CategorySummary[] = grouped.slice(0, 5).map(({ category, totalCents }) => {
    const budgetCents = budgetMap.get(category._id.toString());

    return {
      categoryId: category._id.toString(),
      name: category.name,
      icon: category.icon,
      color: category.color,
      amount: fromCents(totalCents),
      budget: budgetCents !== undefined ? fromCents(budgetCents) : null,
    };
  });

  const incomeCount = transactions.filter(tx => tx.type === 'Income').length;
  const expenseCount = transactions.filter(tx => tx.type === 'Expense').length;
  const daysInMonth = dayjs.utc(from).daysInMonth();
  const savingsRate =
    monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0;

  return {
    shouldShow: true,
    month,
    summary: {
      monthlyIncome,
      monthlyExpenses,
      transactionCount: transactions.length,
      incomeCount,
      expenseCount,
      daysInMonth,
      savingsRate,
      topCategories,
    },
  };
};

export const markSeen = async (userId: string, month: string): Promise<void> => {
  await userRepository.markMonthlyReportSeen(userId, month);
};
