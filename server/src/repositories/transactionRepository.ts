import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';
import { CreateTransactionCommand } from '@shared/types/TransactionCommands';
import { TransactionQueryOptions } from '../types/Transaction';
import {
  buildTransactionQuery,
  expandTransactions,
  filterAndExpandTransactions,
  sortAndPaginate,
} from '../utils/transactionUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const findAll = async (userId: string, options: TransactionQueryOptions = {}) => {
  const { page, limit, from, to, sort = 'desc', categoryId } = options;

  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;

  const query = buildTransactionQuery(userId, fromDate, toDate, categoryId);

  const transactions = await Transaction.find(query)
    .populate('category')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount');

  const filtered = filterAndExpandTransactions(transactions, fromDate, toDate);

  return sortAndPaginate(filtered, sort, page, limit);
};

export const getSummary = async (userId: string, year: number, month?: number) => {
  const normalizeMonth = (m: number) => (m > 11 ? m - 1 : m);

  const isMonthly = month !== undefined;
  const month0 = isMonthly ? normalizeMonth(Number(month - 1)) : undefined;

  const start = isMonthly
    ? dayjs.utc().year(year).month(month0!).startOf('month').toDate()
    : dayjs.utc().year(year).startOf('year').toDate();

  const end = isMonthly
    ? dayjs.utc().year(year).month(month0!).endOf('month').toDate()
    : dayjs.utc().year(year).endOf('year').toDate();

  const transactions = await Transaction.find({
    userId: new Types.ObjectId(userId),
    date: { $lte: end },
  })
    .populate('category')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount');

  const expanded = expandTransactions(transactions, end);

  if (isMonthly) {
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    for (const tx of expanded) {
      if (tx.date >= start && tx.date <= end) {
        if (tx.category?.type === 'Income') monthlyIncome += tx.amount;
        else if (tx.category?.type === 'Expense') monthlyExpenses += tx.amount;
      }
    }

    return { monthlyIncome, monthlyExpenses };
  }

  const buckets = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  }));

  for (const tx of expanded) {
    if (tx.date >= start && tx.date <= end) {
      const m = dayjs.utc(tx.date).month(); // 0–11
      if (tx.category?.type === 'Income') {
        buckets[m].monthlyIncome += tx.amount;
      } else if (tx.category?.type === 'Expense') {
        buckets[m].monthlyExpenses += tx.amount;
      }
    }
  }

  return buckets;
};

export const getYearlySummary = async (userId: string, year: number) =>
  Transaction.aggregate([
    {
      $match: {
        userId,
        date: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$date' } },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: { $subtract: ['$_id.month', 1] },
        income: 1,
        expense: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

export const findById = async (id: string, userId: string) =>
  Transaction.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount');

export const create = async (data: CreateTransactionCommand, userId: string) => {
  const transaction = new Transaction({
    name: data.name,
    amount: data.amount,
    type: data.type,
    recurrence: data.recurrence,
    userId: new Types.ObjectId(userId),
    category: data.categoryId ? new Types.ObjectId(data.categoryId) : undefined,
    account: data.accountId ? new Types.ObjectId(data.accountId) : undefined,
    fromAccount: data.fromAccountId ? new Types.ObjectId(data.fromAccountId) : undefined,
    toAccount: data.toAccountId ? new Types.ObjectId(data.toAccountId) : undefined,
    date: new Date(data.date),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  });

  return transaction.save();
};

export const update = async (id: string, data: Partial<ITransaction>, userId: string) =>
  Transaction.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .populate('category')
    .populate('account');

export const remove = async (id: string, userId: string) =>
  Transaction.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('account');

export const countByAccountId = async (userId: string, accountId: string) =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    account: new Types.ObjectId(accountId),
  });

export const reassignAccountForUser = async (
  userId: string,
  fromAccountId: string,
  toAccountId: string
) =>
  Transaction.updateMany(
    {
      userId: new Types.ObjectId(userId),
      account: new Types.ObjectId(fromAccountId),
    },
    {
      $set: { account: new Types.ObjectId(toAccountId) },
    }
  );
