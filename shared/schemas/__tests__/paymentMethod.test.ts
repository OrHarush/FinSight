import { describe, expect,it } from 'vitest';

import { CreatePaymentMethodSchema } from '../paymentMethod';

describe('CreatePaymentMethodSchema', () => {
  it('accepts valid Credit Card with lastFourDigits and billingDay', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'My Card',
        type: 'Credit Card',
        lastFourDigits: '1234',
        billingDay: 15,
      }).success
    ).toBe(true);
  });

  it('accepts valid Cash (no lastFourDigits, no billingDay)', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({ name: 'Cash', type: 'Cash' }).success
    ).toBe(true);
  });

  it('accepts Debit with lastFourDigits', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'Debit',
        type: 'Debit',
        lastFourDigits: '5678',
      }).success
    ).toBe(true);
  });

  it('rejects Debit with billingDay (billingDay only for Credit Card)', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'Debit',
        type: 'Debit',
        billingDay: 10,
      }).success
    ).toBe(false);
  });

  it('rejects Cash with lastFourDigits', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'Cash',
        type: 'Cash',
        lastFourDigits: '1234',
      }).success
    ).toBe(false);
  });

  it('rejects lastFourDigits with non-4-digit value', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'Card',
        type: 'Credit Card',
        lastFourDigits: '12',
      }).success
    ).toBe(false);
  });

  it('rejects name over 30 chars', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({
        name: 'A'.repeat(31),
        type: 'PayPal',
      }).success
    ).toBe(false);
  });

  it('rejects invalid type', () => {
    expect(
      CreatePaymentMethodSchema.safeParse({ name: 'Test', type: 'BankTransfer' }).success
    ).toBe(false);
  });
});
