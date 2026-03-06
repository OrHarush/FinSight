import { deleteUserById, findById } from '../repositories/userRepository';
import {
  createMany as createCategories,
  deleteMany as deleteCategories,
} from '../repositories/categoryRepository';
import { deleteMany as deleteAccounts, insert } from '../repositories/accountRepository';
import { deleteMany as deleteTransactions } from '../repositories/transactionRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as accountRepository from '../repositories/accountRepository';
import mongoose from 'mongoose';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_ACCOUNT,
} from '../constants/defaultEntities';

export const getCurrentUserById = async (userId: string) => findById(userId);

export const createDefaultEntitiesForNewUser = async (userId: string) => {
  const categoriesToCreate = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    userId,
  }));

  const paymentMethodsToCreate = DEFAULT_PAYMENT_METHODS.map((method) => ({
    ...method,
    userId,
  }));

  await Promise.all([
    createCategories(categoriesToCreate),
    paymentMethodRepository.createMany(paymentMethodsToCreate),
    accountRepository.insert(DEFAULT_ACCOUNT, userId),
  ]);
};

export const deleteUserCompletely = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Promise.all([
      deleteTransactions({ userId: userId }),
      deleteAccounts({ userId: userId }),
      deleteCategories({ userId: userId }),
    ]);

    await deleteUserById(userId);

    await session.commitTransaction();
    await session.endSession();

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};
