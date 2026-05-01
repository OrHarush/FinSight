import { Types } from 'mongoose';

import RecurringTemplate, { IRecurringTemplate } from '../models/RecurringTemplate';
import { IRecurringTemplatePopulated } from '../types/RecurringTemplate';

export const findMany = async (userId: string) =>
  RecurringTemplate.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<IRecurringTemplate[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  RecurringTemplate.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IRecurringTemplate>()
    .exec();

export const findActiveByUser = async (userId: string) =>
  RecurringTemplate.find({ userId: new Types.ObjectId(userId), isActive: true })
    .sort({ createdAt: -1 })
    .lean<IRecurringTemplate[]>()
    .exec();

export const findUserIdsWithActiveTemplates = async (): Promise<string[]> => {
  const userIds = await RecurringTemplate.distinct('userId', { isActive: true });

  return userIds.map((id: Types.ObjectId) => id.toString());
};

export const findActiveForDateRange = async (userId: string, from: Date, to: Date) =>
  RecurringTemplate.find({
    userId: new Types.ObjectId(userId),
    isActive: true,
    startDate: { $lte: to },
    $or: [{ endDate: { $gte: from } }, { endDate: null }],
  })
    .lean<IRecurringTemplate[]>()
    .exec();

export const findActiveForDateRangePopulated = async (userId: string, from: Date, to: Date) =>
  RecurringTemplate.find({
    userId: new Types.ObjectId(userId),
    isActive: true,
    startDate: { $lte: to },
    $or: [{ endDate: { $gte: from } }, { endDate: null }],
  })
    .populate('category')
    .populate('paymentMethod')
    .populate('account')
    .populate('fromAccount')
    .populate('toAccount')
    .lean<IRecurringTemplatePopulated[]>()
    .exec();

export const insert = async (data: Omit<IRecurringTemplate, '_id'>) => {
  const template = new RecurringTemplate(data);

  return template.save();
};

export const updateById = async (id: string, data: Partial<IRecurringTemplate>, userId: string) =>
  RecurringTemplate.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .lean<IRecurringTemplate>()
    .exec();

export const remove = async (id: string, userId: string) =>
  RecurringTemplate.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IRecurringTemplate>()
    .exec();
