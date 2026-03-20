import { describe, expect,it } from 'vitest';

import { CreateTransactionSchema } from '../transaction';

const validId = '507f1f77bcf86cd799439011';
const otherId = '507f1f77bcf86cd799439012';

describe('CreateTransactionSchema — Expense', () => {
  it('accepts valid Expense with accountId, categoryId, date', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 50,
        recurrence: 'None',
        date: '2024-01-15',
        accountId: validId,
        categoryId: otherId,
      }).success
    ).toBe(true);
  });

  it('rejects Expense missing accountId', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 50,
        recurrence: 'None',
        date: '2024-01-15',
        categoryId: otherId,
      }).success
    ).toBe(false);
  });

  it('rejects Expense missing categoryId', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 50,
        recurrence: 'None',
        date: '2024-01-15',
        accountId: validId,
      }).success
    ).toBe(false);
  });

  it('rejects amount = 0', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 0,
        recurrence: 'None',
        date: '2024-01-15',
        accountId: validId,
        categoryId: otherId,
      }).success
    ).toBe(false);
  });
});

describe('CreateTransactionSchema — Transfer', () => {
  it('accepts valid Transfer with fromAccountId and toAccountId', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Transfer',
        amount: 200,
        recurrence: 'None',
        date: '2024-01-15',
        fromAccountId: validId,
        toAccountId: otherId,
      }).success
    ).toBe(true);
  });

  it('rejects Transfer with same fromAccountId and toAccountId', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Transfer',
        amount: 200,
        recurrence: 'None',
        date: '2024-01-15',
        fromAccountId: validId,
        toAccountId: validId,
      }).success
    ).toBe(false);
  });

  it('rejects Transfer with categoryId present', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Transfer',
        amount: 200,
        recurrence: 'None',
        date: '2024-01-15',
        fromAccountId: validId,
        toAccountId: otherId,
        categoryId: validId,
      }).success
    ).toBe(false);
  });
});

describe('CreateTransactionSchema — Recurring', () => {
  it('accepts valid recurring Expense with startDate', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 100,
        recurrence: 'Monthly',
        startDate: '2024-01-01',
        accountId: validId,
        categoryId: otherId,
      }).success
    ).toBe(true);
  });

  it('rejects recurring Expense missing startDate', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 100,
        recurrence: 'Monthly',
        accountId: validId,
        categoryId: otherId,
      }).success
    ).toBe(false);
  });

  it('rejects endDate before startDate', () => {
    expect(
      CreateTransactionSchema.safeParse({
        type: 'Expense',
        amount: 100,
        recurrence: 'Monthly',
        startDate: '2024-06-01',
        endDate: '2024-01-01',
        accountId: validId,
        categoryId: otherId,
      }).success
    ).toBe(false);
  });
});
