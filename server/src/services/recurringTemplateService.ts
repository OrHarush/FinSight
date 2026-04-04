import {
  CreateRecurringTemplateDTO,
  DeactivateFromDTO,
  fromCents,
  SplitRecurringTemplateDTO,
  toCents,
  UpdateRecurringTemplateDTO,
} from '@finsight/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Account from '../models/Account';
import Category from '../models/Category';
import PaymentMethod from '../models/PaymentMethod';
import { IRecurringTemplate } from '../models/RecurringTemplate';
import { ITransaction } from '../models/Transaction';
import * as recurringTemplateRepository from '../repositories/recurringTemplateRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { clampedDate } from './transactions/buildVirtualTransactions';

dayjs.extend(utc);

type RefFields = {
  categoryId?: string;
  accountId?: string;
  paymentMethodId?: string;
  fromAccountId?: string;
  toAccountId?: string;
};

const validateRefs = async (
  type: 'Income' | 'Expense' | 'Transfer',
  refs: RefFields,
  userId: string
) => {
  if (type === 'Income' || type === 'Expense') {
    if (refs.categoryId) {
      const category = await Category.findOne({ _id: refs.categoryId, userId });

      if (!category) {
        throw ApiError.badRequest('Invalid category for this user');
      }

      if (category.type !== type) {
        throw ApiError.badRequest(
          `Category type mismatch: category is ${category.type} but template is ${type}`
        );
      }
    }

    if (refs.accountId) {
      const account = await Account.findOne({ _id: refs.accountId, userId });

      if (!account) {
        throw ApiError.badRequest('Invalid account for this user');
      }
    }
  }

  if (type === 'Transfer') {
    if (refs.fromAccountId) {
      const fromAccount = await Account.findOne({ _id: refs.fromAccountId, userId });

      if (!fromAccount) {
        throw ApiError.badRequest('Invalid fromAccount for this user');
      }
    }

    if (refs.toAccountId) {
      const toAccount = await Account.findOne({ _id: refs.toAccountId, userId });

      if (!toAccount) {
        throw ApiError.badRequest('Invalid toAccount for this user');
      }
    }
  }

  if (!refs.paymentMethodId) {
    throw ApiError.badRequest('Payment method is required');
  }

  const paymentMethod = await PaymentMethod.findOne({ _id: refs.paymentMethodId, userId });

  if (!paymentMethod) {
    throw ApiError.badRequest('Invalid payment method for this user');
  }
};

export const getByUser = async (userId: string) => {
  const templates = await recurringTemplateRepository.findMany(userId);

  return templates.map(t => ({ ...t, amount: fromCents(t.amount) }));
};

export const getById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid recurring template ID');
  }

  const template = await recurringTemplateRepository.findById(id, userId);

  if (!template) {
    throw ApiError.notFound('Recurring template not found');
  }

  return { ...template, amount: fromCents(template.amount) };
};

export const create = async (dto: CreateRecurringTemplateDTO, userId: string) => {
  await validateRefs(dto.type, dto, userId);

  const mapped: Omit<IRecurringTemplate, '_id'> = {
    userId: new Types.ObjectId(userId),
    frequency: dto.frequency,
    dayOfMonth: dto.dayOfMonth,
    startDate: new Date(dto.startDate),
    endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    name: dto.name,
    description: dto.description,
    type: dto.type,
    amount: toCents(dto.amount),
    belongToPreviousMonth: dto.belongToPreviousMonth ?? false,
    category: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
    paymentMethod: dto.paymentMethodId ? new Types.ObjectId(dto.paymentMethodId) : undefined,
    account: dto.accountId ? new Types.ObjectId(dto.accountId) : undefined,
    fromAccount: dto.fromAccountId ? new Types.ObjectId(dto.fromAccountId) : undefined,
    toAccount: dto.toAccountId ? new Types.ObjectId(dto.toAccountId) : undefined,
    isActive: true,
    lastGeneratedDate: null,
  };

  const created = await recurringTemplateRepository.insert(mapped);

  return { ...created.toObject(), amount: fromCents(created.amount) };
};

export const update = async (id: string, dto: UpdateRecurringTemplateDTO, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid recurring template ID');
  }

  const existing = await recurringTemplateRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Recurring template not found');
  }

  const effectiveType = (dto.type ?? existing.type) as 'Income' | 'Expense' | 'Transfer';

  await validateRefs(effectiveType, dto, userId);

  const mapped: Partial<IRecurringTemplate> = {};

  if (dto.frequency !== undefined) mapped.frequency = dto.frequency;
  if (dto.dayOfMonth !== undefined) mapped.dayOfMonth = dto.dayOfMonth;
  if (dto.startDate !== undefined) mapped.startDate = new Date(dto.startDate);
  if (dto.endDate !== undefined) mapped.endDate = new Date(dto.endDate);
  if (dto.name !== undefined) mapped.name = dto.name;
  if (dto.description !== undefined) mapped.description = dto.description;
  if (dto.type !== undefined) mapped.type = dto.type;
  if (dto.amount !== undefined) mapped.amount = toCents(dto.amount);
  if (dto.belongToPreviousMonth !== undefined)
    mapped.belongToPreviousMonth = dto.belongToPreviousMonth;
  if (dto.categoryId !== undefined) mapped.category = new Types.ObjectId(dto.categoryId);
  if (dto.paymentMethodId !== undefined)
    mapped.paymentMethod = new Types.ObjectId(dto.paymentMethodId);
  if (dto.accountId !== undefined) mapped.account = new Types.ObjectId(dto.accountId);
  if (dto.fromAccountId !== undefined) mapped.fromAccount = new Types.ObjectId(dto.fromAccountId);
  if (dto.toAccountId !== undefined) mapped.toAccount = new Types.ObjectId(dto.toAccountId);

  const updated = await recurringTemplateRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error updating recurring template');
  }

  return { ...updated, amount: fromCents(updated.amount) };
};

export const deleteTemplate = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid recurring template ID');
  }

  const existing = await recurringTemplateRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Recurring template not found');
  }

  const deleted = await recurringTemplateRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.internal('Unexpected error deleting recurring template');
  }

  return { ...deleted, amount: fromCents(deleted.amount) };
};

export const createWithTransactions = async (dto: CreateRecurringTemplateDTO, userId: string) => {
  const template = await create(dto, userId);
  const rawTransactions = await generatePendingTransactions(userId);
  const transactions = rawTransactions.map(tx => ({
    ...tx.toObject(),
    amount: fromCents(tx.amount),
  }));

  return { template, transactions };
};

export const deactivateFrom = async (
  templateId: string,
  dto: DeactivateFromDTO,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    throw ApiError.badRequest('Invalid recurring template ID');
  }

  const existing = await recurringTemplateRepository.findById(templateId, userId);

  if (!existing) {
    throw ApiError.notFound('Recurring template not found');
  }

  const fromPoint = dayjs.utc(dto.fromDate).startOf('month');
  const startMonth = dayjs.utc(existing.startDate).startOf('month');
  const isDeletingFromStart = fromPoint.isSame(startMonth, 'month');

  if (isDeletingFromStart) {
    await recurringTemplateRepository.updateById(templateId, { isActive: false }, userId);
    await transactionRepository.deleteByTemplateIdFromDate(templateId, existing.startDate);
  } else {
    const endOfPrevMonth = fromPoint.subtract(1, 'day').toDate();
    await recurringTemplateRepository.updateById(templateId, { endDate: endOfPrevMonth }, userId);
    await transactionRepository.deleteByTemplateIdFromDate(templateId, fromPoint.toDate());
  }

  const updated = await recurringTemplateRepository.findById(templateId, userId);

  return updated ? { ...updated, amount: fromCents(updated.amount) } : null;
};

export const splitTemplate = async (
  templateId: string,
  dto: SplitRecurringTemplateDTO,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    throw ApiError.badRequest('Invalid recurring template ID');
  }

  const existing = await recurringTemplateRepository.findById(templateId, userId);

  if (!existing) {
    throw ApiError.notFound('Recurring template not found');
  }

  const { fromDate, ...changes } = dto;
  const splitPoint = dayjs.utc(fromDate).startOf('month');
  const endOfPrevMonth = splitPoint.subtract(1, 'day').toDate();

  await recurringTemplateRepository.updateById(templateId, { endDate: endOfPrevMonth }, userId);

  const effectiveType = (changes.type ?? existing.type) as 'Income' | 'Expense' | 'Transfer';

  await validateRefs(effectiveType, changes, userId);

  const newTemplateData: Omit<IRecurringTemplate, '_id'> = {
    userId: existing.userId,
    frequency: changes.frequency ?? existing.frequency,
    dayOfMonth: changes.dayOfMonth ?? existing.dayOfMonth,
    startDate: splitPoint.toDate(),
    endDate: changes.endDate ? new Date(changes.endDate) : undefined,
    name: changes.name ?? existing.name,
    description: changes.description ?? existing.description,
    type: effectiveType,
    amount: changes.amount !== undefined ? toCents(changes.amount) : existing.amount,
    belongToPreviousMonth: changes.belongToPreviousMonth ?? existing.belongToPreviousMonth,
    category: changes.categoryId ? new Types.ObjectId(changes.categoryId) : existing.category,
    paymentMethod: changes.paymentMethodId
      ? new Types.ObjectId(changes.paymentMethodId)
      : existing.paymentMethod,
    account: changes.accountId ? new Types.ObjectId(changes.accountId) : existing.account,
    fromAccount: changes.fromAccountId
      ? new Types.ObjectId(changes.fromAccountId)
      : existing.fromAccount,
    toAccount: changes.toAccountId ? new Types.ObjectId(changes.toAccountId) : existing.toAccount,
    isActive: true,
    lastGeneratedDate: null,
  };

  const newTemplate = await recurringTemplateRepository.insert(newTemplateData);

  await transactionRepository.deleteByTemplateIdFromDate(templateId, splitPoint.toDate());

  generatePendingTransactions(userId).catch(err =>
    console.error('Failed to generate pending transactions after split:', err)
  );

  return {
    oldTemplate: existing,
    newTemplate: { ...newTemplate.toObject(), amount: fromCents(newTemplate.amount) },
  };
};

export const generatePendingTransactions = async (userId: string, upToDate: Date = new Date()) => {
  const templates = await recurringTemplateRepository.findActiveByUser(userId);
  const created: Awaited<ReturnType<typeof transactionRepository.insert>>[] = [];
  const upToMonth = dayjs.utc(upToDate).startOf('month');

  for (const template of templates) {
    const startMonth = dayjs.utc(template.startDate).startOf('month');

    if (startMonth.isAfter(upToMonth)) {
      continue;
    }

    const fromMonth = template.lastGeneratedDate
      ? dayjs.utc(template.lastGeneratedDate).startOf('month').add(1, 'month')
      : startMonth;

    if (fromMonth.isAfter(upToMonth)) {
      continue;
    }

    if (template.endDate && dayjs.utc(template.endDate).startOf('month').isBefore(fromMonth)) {
      continue;
    }

    const yearlyMonth = dayjs.utc(template.startDate).month();
    let lastMonth: dayjs.Dayjs | null = null;
    let current = fromMonth;

    while (!current.isAfter(upToMonth)) {
      if (template.endDate && current.isAfter(dayjs.utc(template.endDate).startOf('month'))) {
        break;
      }

      if (template.frequency === 'Yearly' && current.month() !== yearlyMonth) {
        current = current.add(1, 'month');
        continue;
      }

      const txData: Omit<ITransaction, '_id'> = {
        name: template.name ?? '',
        description: template.description,
        type: template.type,
        amount: template.amount,
        date: clampedDate(current.year(), current.month(), template.dayOfMonth),
        frequency: template.frequency,
        belongToPreviousMonth: template.belongToPreviousMonth ?? false,
        category: template.category,
        paymentMethod: template.paymentMethod,
        account: template.account,
        fromAccount: template.fromAccount,
        toAccount: template.toAccount,
        userId: template.userId,
        templateId: new Types.ObjectId(template._id as string),
      };

      const tx = await transactionRepository.insert(txData);

      created.push(tx);
      lastMonth = current;
      current = current.add(1, 'month');
    }

    if (lastMonth) {
      await recurringTemplateRepository.updateById(
        template._id as string,
        {
          lastGeneratedDate: clampedDate(lastMonth.year(), lastMonth.month(), template.dayOfMonth),
        },
        userId
      );
    }
  }

  return created;
};
