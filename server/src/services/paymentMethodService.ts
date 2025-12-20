import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import {
  CreatePaymentMethodCommand,
  UpdatePaymentMethodCommand,
} from '@shared/types/PaymentMethodCommands';
import { ApiError } from '../errors/ApiError';
import mongoose from 'mongoose';

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

export const create = async (details: CreatePaymentMethodCommand, userId: string) => {
  if (!details.name) {
    throw ApiError.badRequest('Payment method name is required');
  }

  if (!details.type) {
    throw ApiError.badRequest('Payment method type is required');
  }

  if (details.type === 'Credit') {
    if (!details.billingDay) {
      throw ApiError.badRequest('Credit card requires billingDay');
    }
    if (details.billingDay < 1 || details.billingDay > 31) {
      throw ApiError.badRequest('billingDay must be between 1 and 31');
    }
  }

  return paymentMethodRepository.create(details, userId);
};

export const update = async (
  id: string,
  updatedDetails: UpdatePaymentMethodCommand,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid payment method ID');
  }

  const existing = await paymentMethodRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Payment method not found');
  }

  if (updatedDetails.type === 'Credit') {
    if (
      updatedDetails.billingDay &&
      (updatedDetails.billingDay < 1 || updatedDetails.billingDay > 31)
    ) {
      throw ApiError.badRequest('billingDay must be between 1 and 31');
    }
  }

  const updated = await paymentMethodRepository.updateById(id, updatedDetails, userId);

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
