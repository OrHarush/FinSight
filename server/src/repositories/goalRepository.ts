import { ClientSession, Types } from 'mongoose';

import Goal, { GoalStatus, IGoal } from '../models/Goal';

interface GoalFilter {
  status?: GoalStatus;
}

export const findMany = async (userId: string, filter: GoalFilter = {}) => {
  const query: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

  if (filter.status) {
    query.status = filter.status;
  }

  return Goal.find(query)
    .sort({ createdAt: -1 })
    .lean<IGoal[]>()
    .exec();
};

export const findById = async (id: string, userId: string) =>
  Goal.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IGoal>()
    .exec();

export const findByCategoryId = async (categoryId: string) =>
  Goal.findOne({ categoryId: new Types.ObjectId(categoryId) })
    .lean<IGoal>()
    .exec();

export const findByNameCaseInsensitive = async (userId: string, name: string) =>
  Goal.findOne({
    userId: new Types.ObjectId(userId),
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: 'i' },
  })
    .lean<IGoal>()
    .exec();

export const insert = async (data: Omit<IGoal, '_id' | 'createdAt' | 'updatedAt'>, session?: ClientSession) => {
  const goal = new Goal(data);

  return goal.save({ session });
};

export const updateById = async (id: string, data: Partial<IGoal>, userId: string) =>
  Goal.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .lean<IGoal>()
    .exec();

export const remove = async (id: string, userId: string, session?: ClientSession) =>
  Goal.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .session(session ?? null)
    .lean<IGoal>()
    .exec();

export const deleteMany = (filter: object, session?: ClientSession) =>
  Goal.deleteMany(filter).session(session ?? null);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
