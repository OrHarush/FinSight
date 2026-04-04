import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ClientSession, Types } from 'mongoose';

import Transaction, { ITransaction } from '../models/Transaction';
import { GetTransactionsOptions } from '../schemas/transactionSchemas';
import { ITransactionPopulated } from '../types/Transaction';
import { buildTransactionQuery } from '../utils/transactionUtils';

dayjs.extend(utc);

export const findMany = async (userId: string, options: GetTransactionsOptions) => {
  const { from, to, categoryIds, paymentMethodIds, accountIds, accountId } = options;
  const resolvedAccountIds = accountIds ?? (accountId ? [accountId] : undefined);

  const query = buildTransactionQuery(userId, from, to, categoryIds, paymentMethodIds, resolvedAccountIds);

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

export const countByPaymentMethodId = async (userId: string, paymentMethodId: string): Promise<number> =>
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
