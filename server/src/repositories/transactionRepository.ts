import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Types } from 'mongoose';

import Transaction, { ITransaction } from '../models/Transaction';
import { GetTransactionsOptions } from '../schemas/transactionSchemas';
import { ITransactionPopulated } from '../types/Transaction';
import { buildTransactionQuery } from '../utils/transactionUtils';

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

export const insert = async (data: ITransaction) => {
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

export const deleteMany = (filter: object) => Transaction.deleteMany(filter);

export const countByAccountId = async (userId: string, accountId: string) =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    account: new Types.ObjectId(accountId),
  });
