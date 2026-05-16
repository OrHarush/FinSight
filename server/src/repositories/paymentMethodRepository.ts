import { ClientSession, Types } from 'mongoose';

import PaymentMethod, { IPaymentMethod } from '../models/PaymentMethod';

export const findMany = async (userId: string) =>
  PaymentMethod.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<IPaymentMethod[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  PaymentMethod.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const findByIds = async (ids: string[], userId: string) =>
  PaymentMethod.find({
    _id: { $in: ids.map(id => new Types.ObjectId(id)) },
    userId: new Types.ObjectId(userId),
  })
    .lean<IPaymentMethod[]>()
    .exec();

export const insert = async (data: Omit<IPaymentMethod, '_id'>) => {
  const method = new PaymentMethod(data);

  return method.save();
};

export const insertMany = (methods: Omit<IPaymentMethod, '_id'>[]) =>
  PaymentMethod.insertMany(methods);

export const updateById = async (id: string, data: Partial<IPaymentMethod>, userId: string) =>
  PaymentMethod.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  });

export const unsetPrimaryForUser = async (userId: string) => {
  await PaymentMethod.updateMany({ userId, isPrimary: true }, { $set: { isPrimary: false } });
};

export const countByUser = async (userId: string): Promise<number> =>
  PaymentMethod.countDocuments({ userId: new Types.ObjectId(userId) });

export const findAnother = async (userId: string, excludeId: string) =>
  PaymentMethod.findOne({
    userId: new Types.ObjectId(userId),
    _id: { $ne: new Types.ObjectId(excludeId) },
  });

export const remove = async (id: string, userId: string) =>
  PaymentMethod.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });

export const deleteMany = (filter: object, session?: ClientSession) =>
  PaymentMethod.deleteMany(filter).session(session ?? null);

export const findByType = async (userId: string, type: string) =>
  PaymentMethod.findOne({ userId: new Types.ObjectId(userId), type });
