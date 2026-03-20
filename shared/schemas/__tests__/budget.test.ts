import { describe, expect,it } from 'vitest';

import { CreateBudgetBulkSchema,CreateBudgetSchema } from '../budget';

const validId = '507f1f77bcf86cd799439011';

describe('CreateBudgetSchema', () => {
  it('accepts valid budget with month 1-12 and positive limit', () => {
    expect(
      CreateBudgetSchema.safeParse({ categoryId: validId, year: 2024, month: 3, limit: 500 })
        .success
    ).toBe(true);
  });

  it('rejects limit = 0', () => {
    expect(
      CreateBudgetSchema.safeParse({ categoryId: validId, year: 2024, month: 3, limit: 0 })
        .success
    ).toBe(false);
  });

  it('rejects month = 0', () => {
    expect(
      CreateBudgetSchema.safeParse({ categoryId: validId, year: 2024, month: 0, limit: 100 })
        .success
    ).toBe(false);
  });

  it('rejects month = 13', () => {
    expect(
      CreateBudgetSchema.safeParse({ categoryId: validId, year: 2024, month: 13, limit: 100 })
        .success
    ).toBe(false);
  });
});

describe('CreateBudgetBulkSchema', () => {
  it('accepts valid bulk with startMonth <= endMonth', () => {
    expect(
      CreateBudgetBulkSchema.safeParse({
        categoryId: validId,
        year: 2024,
        startMonth: 3,
        endMonth: 6,
        limit: 200,
      }).success
    ).toBe(true);
  });

  it('accepts startMonth === endMonth', () => {
    expect(
      CreateBudgetBulkSchema.safeParse({
        categoryId: validId,
        year: 2024,
        startMonth: 5,
        endMonth: 5,
        limit: 200,
      }).success
    ).toBe(true);
  });

  it('rejects startMonth > endMonth', () => {
    expect(
      CreateBudgetBulkSchema.safeParse({
        categoryId: validId,
        year: 2024,
        startMonth: 8,
        endMonth: 3,
        limit: 200,
      }).success
    ).toBe(false);
  });
});
