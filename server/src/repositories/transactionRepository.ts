import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';
import { CreateTransactionCommand } from '@shared/types/TransactionCommands';
import { TransactionQueryOptions } from '../types/Transaction';
import { expandTransactions } from '../utils/transactionUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const findAll = async (userId: string, options: TransactionQueryOptions = {}) => {
  const { page, limit, from, to, sort = 'desc' } = options;

  const query: any = { userId: new Types.ObjectId(userId) };

  if (from || to) {
    query.date = {};

    if (from) {
      query.date.$gte = new Date(from);
    }
    if (to) {
      query.date.$lte = new Date(to);
    }
  }

  let cursor = Transaction.find(query)
    .sort({ date: sort === 'asc' ? 1 : -1 })
    .populate('category')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount');

  if (page && limit) {
    const skip = (page - 1) * limit;
    cursor = cursor.skip(skip).limit(limit);
  }

  const [transactions, total] = await Promise.all([cursor, Transaction.countDocuments(query)]);

  return {
    data: transactions,
    pagination:
      page && limit
        ? {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          }
        : undefined,
  };
};

export const getSummary = async (userId: string, year: number, month?: number) => {
  const normalizeMonth = (m: number) => (m > 11 ? m - 1 : m);

  const isMonthly = month !== undefined; // don't use truthiness!
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

  console.log(
    'expanded',
    expanded.map((x) => ({ name: x.name, date: x.date, amount: x.amount }))
  );

  if (isMonthly) {
    // monthly summary keeps your original semantics: expand -> filter window -> reduce
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

  // yearly summary: bucket by month (0–11) within the year window
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

// export const getSummary = async (userId: string, year: number, month: number) => {
//   const start = dayjs
//     .utc()
//     .year(year)
//     .month(month - 1)
//     .startOf('month')
//     .toDate();
//   const end = dayjs
//     .utc()
//     .year(year)
//     .month(month - 1)
//     .endOf('month')
//     .toDate();
//
//
//   const transactions = await Transaction.find({
//     userId: new Types.ObjectId(userId),
//   })
//     .populate('category')
//     .populate('account')
//     .populate('fromAccount')
//     .populate('toAccount');
//
//   const expanded = expandTransactions(transactions, end);
//
//   const monthlyTx = expanded.filter((tx) => tx.date >= start && tx.date <= end);
//
//   return monthlyTx.reduce(
//     (acc, tx) => {
//       if (tx.category?.type === 'Income') acc.monthlyIncome += tx.amount;
//       if (tx.category?.type === 'Expense') acc.monthlyExpenses += tx.amount;
//       return acc;
//     },
//     { monthlyIncome: 0, monthlyExpenses: 0 }
//   );
// };

// transactionRepository.ts
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
