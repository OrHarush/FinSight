import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ClientSession, Types } from 'mongoose';

import Transaction, { ITransaction } from '../models/Transaction';
import { GetTransactionsOptions } from '../schemas/transactionSchemas';
import { ITransactionPopulated } from '../types/Transaction';
import { buildTransactionQuery } from '../utils/transaction';

dayjs.extend(utc);

export const findMany = async (userId: string, options: GetTransactionsOptions) => {
  const { from, to, categoryIds, paymentMethodIds, accountIds, accountId } = options;
  const resolvedAccountIds = accountIds ?? (accountId ? [accountId] : undefined);

  const query = buildTransactionQuery(
    userId,
    from,
    to,
    categoryIds,
    paymentMethodIds,
    resolvedAccountIds
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

export const countByUser = async (userId: string): Promise<number> =>
  Transaction.countDocuments({ userId });

export const findExistingFingerprints = async (
  userId: string,
  fingerprints: string[]
): Promise<string[]> =>
  Transaction.distinct('importFingerprint', {
    userId: new Types.ObjectId(userId),
    importFingerprint: { $in: fingerprints },
  });

export const countGroupedByUser = async (): Promise<{ userId: string; count: number }[]> => {
  const rows = await Transaction.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ]);

  return rows.map(row => ({ userId: row._id.toString(), count: row.count }));
};

export const countDistinctUsers = async (): Promise<number> => {
  const userIds = await Transaction.distinct('userId');

  return userIds.length;
};

export const insert = async (data: Omit<ITransaction, '_id'>) => {
  const transaction = new Transaction(data);

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

export const insertMany = (data: Omit<ITransaction, '_id'>[]) =>
  Transaction.insertMany(data, { ordered: false });

export const deleteMany = (filter: object, session?: ClientSession) =>
  Transaction.deleteMany(filter).session(session ?? null);

export const findAllByUser = async (userId: string) =>
  Transaction.find({ userId: new Types.ObjectId(userId) }).lean<ITransaction[]>().exec();

export const deleteByTemplateIdFromDate = (templateId: string, fromDate: Date) =>
  Transaction.deleteMany({
    templateId: new Types.ObjectId(templateId),
    date: { $gte: fromDate },
  });

export const countByAccountId = async (userId: string, accountId: string) =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    account: new Types.ObjectId(accountId),
  });

export const countByPaymentMethodId = async (
  userId: string,
  paymentMethodId: string
): Promise<number> =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    paymentMethod: new Types.ObjectId(paymentMethodId),
  });

export const reassignPaymentMethod = async (userId: string, oldId: string, newId: string) =>
  Transaction.updateMany(
    { userId: new Types.ObjectId(userId), paymentMethod: new Types.ObjectId(oldId) },
    { $set: { paymentMethod: new Types.ObjectId(newId) } }
  );

export const reassignAccount = async (userId: string, oldId: string, newId: string) =>
  Transaction.updateMany(
    { userId: new Types.ObjectId(userId), account: new Types.ObjectId(oldId) },
    { $set: { account: new Types.ObjectId(newId) } }
  );

export interface QuickChipAggregation {
  name: string;
  categoryId: Types.ObjectId;
  paymentMethodId: Types.ObjectId;
  latestAmount: number;
  latestDate: Date;
  occurrences: number;
  recencyFrequencyScore: number;
}

export const aggregateFrequentExpensePatterns = async (
  userId: string,
  since: Date,
  now: Date,
  minOccurrences: number,
  limit: number
): Promise<QuickChipAggregation[]> => {
  const windowDays = Math.max(1, (now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24));

  return Transaction.aggregate<QuickChipAggregation>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        type: 'Expense',
        date: { $gte: since, $lte: now },
        name: { $exists: true, $nin: [null, ''] },
        category: { $exists: true, $ne: null },
        paymentMethod: { $exists: true, $ne: null },
        templateId: { $in: [null, undefined] },
        frequency: { $in: [null, undefined] },
      },
    },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: {
          name: '$name',
          categoryId: '$category',
          paymentMethodId: '$paymentMethod',
        },
        latestAmount: { $first: '$amount' },
        latestDate: { $first: '$date' },
        occurrences: { $sum: 1 },
        daysAgoList: {
          $push: {
            $divide: [{ $subtract: [now, '$date'] }, 1000 * 60 * 60 * 24],
          },
        },
      },
    },
    { $match: { occurrences: { $gte: minOccurrences } } },
    {
      $addFields: {
        recencyFrequencyScore: {
          $sum: {
            $map: {
              input: '$daysAgoList',
              as: 'daysAgo',
              in: {
                $divide: [1, { $add: [{ $divide: ['$$daysAgo', windowDays] }, 0.1] }],
              },
            },
          },
        },
      },
    },
    { $sort: { recencyFrequencyScore: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        name: '$_id.name',
        categoryId: '$_id.categoryId',
        paymentMethodId: '$_id.paymentMethodId',
        latestAmount: 1,
        latestDate: 1,
        occurrences: 1,
        recencyFrequencyScore: 1,
      },
    },
  ]);
};
