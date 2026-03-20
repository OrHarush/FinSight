import { CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '@finsight/shared';
import { Types } from 'mongoose';

import PaymentMethod, { IPaymentMethod } from '../models/PaymentMethod';

export const findMany = async (userId: string) =>
  PaymentMethod.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<IPaymentMethod[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  PaymentMethod.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const create = async (details: CreatePaymentMethodDTO, userId: string) => {
  const method = new PaymentMethod({
    ...details,
    userId: new Types.ObjectId(userId),
  });

  return method.save();
};

export const createMany = (methods: (CreatePaymentMethodDTO & { userId: string })[]) =>
  PaymentMethod.insertMany(methods);

export const updateById = async (
  id: string,
  updatedDetails: UpdatePaymentMethodDTO,
  userId: string
) =>
  PaymentMethod.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, updatedDetails, {
    new: true,
    runValidators: true,
  });

export const unsetPrimaryForUser = async (userId: string) => {
  await PaymentMethod.updateMany({ userId, isPrimary: true }, { $set: { isPrimary: false } });
};

export const remove = async (id: string, userId: string) =>
  PaymentMethod.findOneAndDelete({
    _id: id,
    userId: new Types.ObjectId(userId),
  });

export const deleteMany = (filter: object) => PaymentMethod.deleteMany(filter);
