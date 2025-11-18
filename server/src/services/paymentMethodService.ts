import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import {
  CreatePaymentMethodCommand,
  UpdatePaymentMethodCommand,
} from '@shared/types/PaymentMethodCommands';

export const findAll = async (userId: string) => paymentMethodRepository.findMany(userId);

export const getById = async (id: string, userId: string) =>
  paymentMethodRepository.findById(id, userId);

export const create = async (details: CreatePaymentMethodCommand, userId: string) =>
  paymentMethodRepository.create(details, userId);

export const update = async (
  id: string,
  updatedDetails: UpdatePaymentMethodCommand,
  userId: string
) => paymentMethodRepository.updateById(id, updatedDetails, userId);

export const deleteById = async (id: string, userId: string) =>
  paymentMethodRepository.remove(id, userId);
