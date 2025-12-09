import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';
import { CreateTransactionCommand } from '@shared/types/TransactionCommmands';
import { ITransactionPopulated, TransactionQueryOptions } from '../types/Transaction';
import { buildTransactionQuery, expandTransactions } from '../utils/transactionUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const findMany = async (userId: string, options: TransactionQueryOptions = {}) => {
  const { from, to, categoryId, paymentMethodId, accountId } = options;

  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;

  const query = buildTransactionQuery(
    userId,
    fromDate,
    toDate,
    categoryId,
    paymentMethodId,
    accountId
  );

  return await Transaction.find(query)
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount')
    .lean<ITransactionPopulated[]>()
    .exec();
};

export const findById = async (id: string, userId: string) =>
  Transaction.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount')
    .lean<ITransactionPopulated>()
    .exec();

export const insert = async (data: CreateTransactionCommand, userId: string) => {
  const transaction = new Transaction({
    name: data.name,
    amount: data.amount,
    type: data.type,
    recurrence: data.recurrence,
    date: new Date(data.date),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    userId: new Types.ObjectId(userId),
    category: data.categoryId ? new Types.ObjectId(data.categoryId) : undefined,
    paymentMethod: data.paymentMethodId ? new Types.ObjectId(data.paymentMethodId) : undefined,
    account: data.accountId ? new Types.ObjectId(data.accountId) : undefined,
    fromAccount: data.fromAccountId ? new Types.ObjectId(data.fromAccountId) : undefined,
    toAccount: data.toAccountId ? new Types.ObjectId(data.toAccountId) : undefined,
  });

  return transaction.save();
};

export const updateById = async (id: string, data: Partial<ITransaction>, userId: string) =>
  Transaction.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .lean<ITransactionPopulated>()
    .exec();

export const remove = async (id: string, userId: string) =>
  Transaction.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .lean<ITransactionPopulated>()
    .exec();

export const deleteMany = (filter: object) => Transaction.deleteMany(filter);

export const countByAccountId = async (userId: string, accountId: string) =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    account: new Types.ObjectId(accountId),
  });

export const getSummary = async (
  userId: string,
  year: number,
  month?: number,
  accountId?: string
) => {
  const isMonthly = month !== undefined;

  const start = isMonthly
    ? dayjs.utc().year(year).month(month!).startOf('month').toDate()
    : dayjs.utc().year(year).startOf('year').toDate();

  const end = isMonthly
    ? dayjs.utc().year(year).month(month!).endOf('month').toDate()
    : dayjs.utc().year(year).endOf('year').toDate();

  const mongoFilter: any = {
    userId: new Types.ObjectId(userId),
    $or: [{ date: { $lte: end } }, { startDate: { $lte: end } }],
  };

  if (accountId) {
    mongoFilter.$or = [
      { account: accountId },
      { fromAccount: accountId },
      { toAccount: accountId },
    ];
  }

  const transactions = await Transaction.find(mongoFilter)
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount')
    .lean<ITransactionPopulated[]>()
    .exec();

  const expanded = expandTransactions(transactions, end);

  if (isMonthly) {
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    for (const tx of expanded) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (tx.date < start || tx.date > end) {
        continue;
      }

      if (tx.type !== 'Transfer') {
        if (accountId && tx.account?._id.toString() !== accountId) {
          continue;
        }

        if (tx.category?.type === 'Income') {
          monthlyIncome += tx.amount;
        } else if (tx.category?.type === 'Expense') {
          monthlyExpenses += tx.amount;
        }
      }

      if (tx.type === 'Transfer' && accountId) {
        const from = tx.fromAccount?._id.toString();
        const to = tx.toAccount?._id.toString();

        if (from === accountId) {
          monthlyExpenses += tx.amount;
        }

        if (to === accountId) {
          monthlyIncome += tx.amount;
        }
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (tx.date < start || tx.date > end) continue;

    const m = dayjs.utc(tx.date).month();

    if (tx.type !== 'Transfer') {
      if (!accountId || tx.account?._id.toString() === accountId) {
        if (tx.category?.type === 'Income') {
          buckets[m].monthlyIncome += tx.amount;
        } else if (tx.category?.type === 'Expense') {
          buckets[m].monthlyExpenses += tx.amount;
        }
      }
    }

    if (tx.type === 'Transfer' && accountId) {
      const from = tx.fromAccount?._id.toString();
      const to = tx.toAccount?._id.toString();

      if (from === accountId) {
        buckets[m].monthlyExpenses += tx.amount;
      }

      if (to === accountId) {
        buckets[m].monthlyIncome += tx.amount;
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
