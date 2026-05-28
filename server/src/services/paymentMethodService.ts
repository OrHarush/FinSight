import { CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '@lyra/shared';
import mongoose, { Types } from 'mongoose';

import { DEFAULT_PAYMENT_METHODS } from '../constants/defaultEntities';
import { ApiError } from '../errors/ApiError';
import { IPaymentMethod } from '../models/PaymentMethod';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as analyticsService from './analyticsService';

export const findAll = async (workspaceId: string) =>
  paymentMethodRepository.findMany(workspaceId);

export const getById = async (id: string, workspaceId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const method = await paymentMethodRepository.findById(id, workspaceId);

  if (!method) {
    throw ApiError.notFound('Payment method not found');
  }

  return method;
};

export const createDefaultBankTransfer = async (
  userId: string,
  workspaceId: string
): Promise<IPaymentMethod> => {
  const existing = await paymentMethodRepository.findByType(workspaceId, 'Bank Transfer');

  if (existing) {
    return existing.toObject ? existing.toObject() : existing;
  }

  const template = DEFAULT_PAYMENT_METHODS.find(pm => pm.type === 'Bank Transfer');

  if (!template) {
    throw ApiError.internal('Default Bank Transfer template is missing.');
  }

  const mapped: Omit<IPaymentMethod, '_id'> = {
    name: template.name,
    type: template.type,
    billingDay: template.billingDay ?? null,
    lastFourDigits: template.lastFourDigits,
    isPrimary: template.isPrimary ?? false,
    key: template.key,
    userId: new Types.ObjectId(userId),
    workspaceId: new Types.ObjectId(workspaceId),
  };

  const created = await paymentMethodRepository.insert(mapped);

  void analyticsService
    .track(userId, 'payment_method_created')
    .catch(err => console.error('Failed to track payment_method_created:', err));

  return created;
};

export const create = async (
  details: CreatePaymentMethodDTO,
  userId: string,
  workspaceId: string
) => {
  const mapped: Omit<IPaymentMethod, '_id'> = {
    name: details.name,
    type: details.type,
    billingDay: details.billingDay ?? null,
    lastFourDigits: details.lastFourDigits,
    isPrimary: details.isPrimary ?? false,
    userId: new Types.ObjectId(userId),
    workspaceId: new Types.ObjectId(workspaceId),
  };

  const created = await paymentMethodRepository.insert(mapped);

  void analyticsService
    .track(userId, 'payment_method_created')
    .catch(err => console.error('Failed to track payment_method_created:', err));

  return created;
};

export const update = async (
  id: string,
  updatedDetails: UpdatePaymentMethodDTO,
  workspaceId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, workspaceId);

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

  const updated = await paymentMethodRepository.updateById(id, mapped, workspaceId);

  if (!updated) {
    throw ApiError.internal('Failed to update payment method');
  }

  return updated;
};

export const setPrimary = async (id: string, workspaceId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, workspaceId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  if (existing.isPrimary) {
    return existing;
  }

  await paymentMethodRepository.unsetPrimaryForWorkspace(workspaceId);

  const updated = await paymentMethodRepository.updateById(id, { isPrimary: true }, workspaceId);

  if (!updated) {
    throw ApiError.internal('Failed to set payment method as primary');
  }

  return updated;
};

export const deleteById = async (id: string, workspaceId: string, replacementId?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, workspaceId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  const totalCount = await paymentMethodRepository.countByWorkspace(workspaceId);

  if (totalCount <= 1) {
    throw ApiError.badRequest('Cannot delete the only payment method');
  }

  const txCount = await transactionRepository.countByPaymentMethodId(workspaceId, id);

  if (txCount > 0) {
    if (replacementId) {
      if (!mongoose.Types.ObjectId.isValid(replacementId)) {
        throw ApiError.badRequest('Invalid replacement payment method ID');
      }

      await transactionRepository.reassignPaymentMethod(workspaceId, id, replacementId);
    } else if (totalCount === 2) {
      const other = await paymentMethodRepository.findAnother(workspaceId, id);

      if (other) {
        await transactionRepository.reassignPaymentMethod(workspaceId, id, other._id.toString());
      }
    } else {
      throw ApiError.badRequest('Replacement payment method is required when transactions exist');
    }
  }

  const deleted = await paymentMethodRepository.remove(id, workspaceId);

  if (!deleted) {
    throw ApiError.internal('Failed to delete payment method');
  }

  if (deleted.isPrimary) {
    const newPrimary = await paymentMethodRepository.findAnother(workspaceId, id);

    if (newPrimary) {
      await paymentMethodRepository.updateById(
        newPrimary._id.toString(),
        { isPrimary: true },
        workspaceId
      );
    }
  }

  return deleted;
};
