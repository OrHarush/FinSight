import { describe, expect,it } from 'vitest';

import { CreateAccountSchema, UpdateAccountSchema } from '../account';

describe('CreateAccountSchema', () => {
  it('accepts valid name + balance', () => {
    expect(CreateAccountSchema.safeParse({ name: 'My Account', balance: 1000 }).success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(CreateAccountSchema.safeParse({ balance: 1000 }).success).toBe(false);
  });

  it('rejects name over 40 chars', () => {
    expect(
      CreateAccountSchema.safeParse({ name: 'A'.repeat(41), balance: 1000 }).success
    ).toBe(false);
  });

  it('rejects balance = 0', () => {
    expect(CreateAccountSchema.safeParse({ name: 'Account', balance: 0 }).success).toBe(false);
  });

  it('rejects balance out of range', () => {
    expect(
      CreateAccountSchema.safeParse({ name: 'Account', balance: 1_000_000_000 }).success
    ).toBe(false);
  });

  it('accepts optional accountNumber with digits only', () => {
    expect(
      CreateAccountSchema.safeParse({ name: 'Account', balance: 500, accountNumber: '12345' })
        .success
    ).toBe(true);
  });

  it('rejects accountNumber with non-digits', () => {
    expect(
      CreateAccountSchema.safeParse({ name: 'Account', balance: 500, accountNumber: 'abc' })
        .success
    ).toBe(false);
  });
});

describe('UpdateAccountSchema', () => {
  it('accepts partial update with at least one field', () => {
    expect(UpdateAccountSchema.safeParse({ name: 'New Name' }).success).toBe(true);
  });

  it('rejects empty object', () => {
    expect(UpdateAccountSchema.safeParse({}).success).toBe(false);
  });
});
