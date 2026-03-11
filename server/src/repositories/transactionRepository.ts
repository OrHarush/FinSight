import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';
import { CreateTransactionCommand } from '@shared/types/TransactionCommmands';
import { ITransactionPopulated } from '../types/Transaction';
import { GetTransactionsOptions } from '../schemas/transactionSchemas';
import { buildTransactionQuery } from '../utils/transactionUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const findMany = async (userId: string, options: GetTransactionsOptions) => {
  const { from, to, categoryId, paymentMethodId, accountId } = options;

  const query = buildTransactionQuery(userId, from, to, categoryId, paymentMethodId, accountId);

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

export const insert = async (data: CreateTransactionCommand, userId: string) => {
  const transaction = new Transaction({
    name: data.name,
    amount: data.amount,
    type: data.type,
    recurrence: data.recurrence,
    date: data.date ? new Date(data.date) : undefined,
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
