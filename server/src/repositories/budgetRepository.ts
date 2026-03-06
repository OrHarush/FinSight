import Budget, { IBudget } from '../models/Budget';
import { Types } from 'mongoose';
import { CreateBudgetCommand, UpdateBudgetCommand } from '@shared/types/BudgetCommands';

interface BudgetQueryOptions {
  year?: number;
  month?: number;
  categoryId?: string;
}

export const findMany = async (userId: string, options: BudgetQueryOptions = {}) => {
  const { year, month, categoryId } = options;

  const query: any = { userId: new Types.ObjectId(userId) };

  if (year !== undefined) query.year = year;
  if (month !== undefined) query.month = month;
  if (categoryId) query.categoryId = new Types.ObjectId(categoryId);

  return Budget.find(query)
    .populate('categoryId')
    .sort({ year: -1, month: -1, createdAt: -1 })
    .lean<IBudget[]>()
    .exec();
};

export const findById = async (id: string, userId: string) =>
  Budget.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('categoryId')
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

export const insert = async (data: CreateBudgetCommand, userId: string) => {
  const budget = new Budget({
    userId: new Types.ObjectId(userId),
    categoryId: new Types.ObjectId(data.categoryId),
    year: data.year,
    month: data.month,
    limit: data.limit,
  });

  return budget.save();
};

export const insertMany = async (budgets: Array<CreateBudgetCommand & { userId: string }>) => {
  const formatted = budgets.map((b) => ({
    userId: new Types.ObjectId(b.userId),
    categoryId: new Types.ObjectId(b.categoryId),
    year: b.year,
    month: b.month,
    limit: b.limit,
  }));

  return Budget.insertMany(formatted);
};

export const updateById = async (id: string, data: UpdateBudgetCommand, userId: string) =>
  Budget.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .populate('categoryId')
    .lean<IBudget>()
    .exec();

export const remove = async (id: string, userId: string) =>
  Budget.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IBudget>()
    .exec();

export const deleteMany = (filter: object) => Budget.deleteMany(filter);

export const countByUser = async (userId: string): Promise<number> =>
  Budget.countDocuments({ userId: new Types.ObjectId(userId) });
