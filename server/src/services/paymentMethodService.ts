import { CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '@finsight/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IPaymentMethod } from '../models/PaymentMethod';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';

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

  if (updatedDetails.name !== undefined) mapped.name = updatedDetails.name;
  if (updatedDetails.type !== undefined) mapped.type = updatedDetails.type;
  if (updatedDetails.billingDay !== undefined) mapped.billingDay = updatedDetails.billingDay ?? null;
  if (updatedDetails.lastFourDigits !== undefined) mapped.lastFourDigits = updatedDetails.lastFourDigits;
  if (updatedDetails.isPrimary !== undefined) mapped.isPrimary = updatedDetails.isPrimary;

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

export const deleteById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  const deleted = await paymentMethodRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.internal('Failed to delete payment method');
  }

  return deleted;
};
