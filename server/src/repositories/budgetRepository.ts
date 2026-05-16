import { ClientSession, Types } from 'mongoose';

import Budget, { IBudget } from '../models/Budget';

interface BudgetFilter {
  year?: number;
  month?: number;
}

export const findMany = async (userId: string, filter: BudgetFilter) => {
  const query: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

  if (filter.year !== undefined) {
    query.year = filter.year;
  }

  if (filter.month !== undefined) {
    query.month = filter.month;
  }

  return Budget.find(query).sort({ year: -1, month: -1, createdAt: -1 }).lean<IBudget[]>().exec();
};

export const findById = async (id: string, userId: string) =>
  Budget.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IBudget>()
    .exec();

export const findByMonthYearCategory = async (
  userId: string,
  categoryId: string,
  year: number,
  month: number
) =>
  Budget.findOne({
    userId: new Types.ObjectId(userId),
    categoryId: new Types.ObjectId(categoryId),
    year,
    month,
  })
    .lean<IBudget>()
    .exec();

export const insert = async (data: Omit<IBudget, '_id'>) => {
  const budget = new Budget(data);

  return budget.save();
};

export const insertMany = (budgets: Omit<IBudget, '_id'>[]) => Budget.insertMany(budgets);

export const updateById = async (id: string, data: Partial<IBudget>, userId: string) =>
  Budget.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .lean<IBudget>()
    .exec();

export const remove = async (id: string, userId: string) =>
  Budget.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IBudget>()
    .exec();

export const deleteMany = (filter: object, session?: ClientSession) =>
  Budget.deleteMany(filter).session(session ?? null);

export const findAllByUser = async (userId: string) =>
  Budget.find({ userId: new Types.ObjectId(userId) }).lean<IBudget[]>().exec();
