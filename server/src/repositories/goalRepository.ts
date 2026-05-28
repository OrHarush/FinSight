import { ClientSession, Types } from 'mongoose';

import Goal, { GoalStatus, IGoal } from '../models/Goal';

interface GoalFilter {
  status?: GoalStatus;
}

export const findMany = async (workspaceId: string, filter: GoalFilter = {}) => {
  const query: Record<string, unknown> = { workspaceId: new Types.ObjectId(workspaceId) };

  if (filter.status) {
    query.status = filter.status;
  }

  return Goal.find(query)
    .sort({ createdAt: -1 })
    .lean<IGoal[]>()
    .exec();
};

export const findById = async (id: string, workspaceId: string) =>
  Goal.findOne({ _id: id, workspaceId: new Types.ObjectId(workspaceId) })
    .lean<IGoal>()
    .exec();

// No userId/workspaceId arg — categoryId itself is unique across the collection (per the goal model index).
export const findByCategoryId = async (categoryId: string) =>
  Goal.findOne({ categoryId: new Types.ObjectId(categoryId) })
    .lean<IGoal>()
    .exec();

export const findByNameCaseInsensitive = async (workspaceId: string, name: string) =>
  Goal.findOne({
    workspaceId: new Types.ObjectId(workspaceId),
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: 'i' },
  })
    .lean<IGoal>()
    .exec();

export const insert = async (
  data: Omit<IGoal, '_id' | 'createdAt' | 'updatedAt'>,
  session?: ClientSession
) => {
  const goal = new Goal(data);

  return goal.save({ session });
};

export const updateById = async (id: string, data: Partial<IGoal>, workspaceId: string) =>
  Goal.findOneAndUpdate(
    { _id: id, workspaceId: new Types.ObjectId(workspaceId) },
    data,
    { new: true, runValidators: true }
  )
    .lean<IGoal>()
    .exec();

export const remove = async (id: string, workspaceId: string, session?: ClientSession) =>
  Goal.findOneAndDelete({ _id: id, workspaceId: new Types.ObjectId(workspaceId) })
    .session(session ?? null)
    .lean<IGoal>()
    .exec();

export const deleteMany = (filter: object, session?: ClientSession) =>
  Goal.deleteMany(filter).session(session ?? null);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
