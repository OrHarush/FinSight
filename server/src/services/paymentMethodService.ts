import { CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '@lyra/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IPaymentMethod } from '../models/PaymentMethod';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as transactionRepository from '../repositories/transactionRepository';

export const findAll = async (userId: string) => paymentMethodRepository.findMany(userId);

export const getById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const method = await paymentMethodRepository.findById(id, userId);

  if (!method) {
    throw ApiError.notFound('Payment method not found');
  }

  return method;
};

export const create = async (details: CreatePaymentMethodDTO, userId: string) => {
  const mapped: Omit<IPaymentMethod, '_id'> = {
    name: details.name,
    type: details.type,
    billingDay: details.billingDay ?? null,
    lastFourDigits: details.lastFourDigits,
    isPrimary: details.isPrimary ?? false,
    userId: new Types.ObjectId(userId),
  };

  return paymentMethodRepository.insert(mapped);
};

export const update = async (
  id: string,
  updatedDetails: UpdatePaymentMethodDTO,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  const mapped: Partial<IPaymentMethod> = {};

  if (updatedDetails.name !== undefined) {
    mapped.name = updatedDetails.name;
  }
  if (updatedDetails.type !== undefined) {
    mapped.type = updatedDetails.type;
  }
  if (updatedDetails.billingDay !== undefined) {
    mapped.billingDay = updatedDetails.billingDay ?? null;
  }
  if (updatedDetails.lastFourDigits !== undefined) {
    mapped.lastFourDigits = updatedDetails.lastFourDigits;
  }
  if (updatedDetails.isPrimary !== undefined) {
    mapped.isPrimary = updatedDetails.isPrimary;
  }

  const updated = await paymentMethodRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.internal('Failed to update payment method');
  }

  return updated;
};

export const setPrimary = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  if (existing.isPrimary) {
    return existing;
  }

  await paymentMethodRepository.unsetPrimaryForUser(userId);

  const updated = await paymentMethodRepository.updateById(id, { isPrimary: true }, userId);

  if (!updated) {
    throw ApiError.internal('Failed to set payment method as primary');
  }

  return updated;
};

export const deleteById = async (id: string, userId: string, replacementId?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  const totalCount = await paymentMethodRepository.countByUser(userId);

  if (totalCount <= 1) {
    throw ApiError.badRequest('Cannot delete the only payment method');
  }

  const txCount = await transactionRepository.countByPaymentMethodId(userId, id);

  if (txCount > 0) {
    if (replacementId) {
      if (!mongoose.Types.ObjectId.isValid(replacementId)) {
        throw ApiError.badRequest('Invalid replacement payment method ID');
      }

      await transactionRepository.reassignPaymentMethod(userId, id, replacementId);
    } else if (totalCount === 2) {
      const other = await paymentMethodRepository.findAnother(userId, id);

      if (other) {
        await transactionRepository.reassignPaymentMethod(userId, id, other._id.toString());
      }
    } else {
      throw ApiError.badRequest('Replacement payment method is required when transactions exist');
    }
  }

  const deleted = await paymentMethodRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.internal('Failed to delete payment method');
  }

  if (deleted.isPrimary) {
    const newPrimary = await paymentMethodRepository.findAnother(userId, id);

    if (newPrimary) {
      await paymentMethodRepository.updateById(
        newPrimary._id.toString(),
        { isPrimary: true },
        userId
      );
    }
  }

  return deleted;
};
