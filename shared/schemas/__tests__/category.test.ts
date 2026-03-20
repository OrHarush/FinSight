import { describe, expect,it } from 'vitest';

import { CreateCategorySchema, UpdateCategorySchema } from '../category';

describe('CreateCategorySchema', () => {
  it('accepts valid name + type', () => {
    expect(
      CreateCategorySchema.safeParse({ name: 'Groceries', type: 'Expense' }).success
    ).toBe(true);
  });

  it('rejects missing name', () => {
    expect(CreateCategorySchema.safeParse({ type: 'Expense' }).success).toBe(false);
  });

  it('rejects name over 30 chars', () => {
    expect(
      CreateCategorySchema.safeParse({ name: 'A'.repeat(31), type: 'Income' }).success
    ).toBe(false);
  });

  it('rejects invalid type', () => {
    expect(
      CreateCategorySchema.safeParse({ name: 'Test', type: 'Transfer' }).success
    ).toBe(false);
  });
});

describe('UpdateCategorySchema', () => {
  it('accepts partial update', () => {
    expect(UpdateCategorySchema.safeParse({ name: 'Updated' }).success).toBe(true);
  });

  it('accepts empty object', () => {
    expect(UpdateCategorySchema.safeParse({}).success).toBe(true);
  });
});
