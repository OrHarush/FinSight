import PaymentMethod from '../models/PaymentMethod';
import { Types } from 'mongoose';
import {
  CreatePaymentMethodCommand,
  UpdatePaymentMethodCommand,
} from '@shared/types/PaymentMethodCommands';

export const findMany = async (userId: string) =>
  PaymentMethod.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });

export const findById = async (id: string, userId: string) =>
  PaymentMethod.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const create = async (details: CreatePaymentMethodCommand, userId: string) => {
  const method = new PaymentMethod({
    ...details,
    userId: new Types.ObjectId(userId),
  });

  return method.save();
};

export const createMany = (items: CreatePaymentMethodCommand[]) => PaymentMethod.insertMany(items);

export const updateById = async (
  id: string,
  updatedDetails: UpdatePaymentMethodCommand,
  userId: string
) =>
  PaymentMethod.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, updatedDetails, {
    new: true,
    runValidators: true,
  });

export const remove = async (id: string, userId: string) =>
  PaymentMethod.findOneAndDelete({
    _id: id,
    userId: new Types.ObjectId(userId),
  });

export const deleteMany = (filter: object) => PaymentMethod.deleteMany(filter);
