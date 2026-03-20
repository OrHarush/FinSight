import { describe, expect,it } from 'vitest';

import { amountSchema, nameSchema, objectIdSchema, positiveAmountSchema } from '../common';

describe('objectIdSchema', () => {
  it('accepts a valid 24-hex ObjectId', () => {
    expect(objectIdSchema.safeParse('507f1f77bcf86cd799439011').success).toBe(true);
  });

  it('rejects a string that is too short', () => {
    expect(objectIdSchema.safeParse('abc123').success).toBe(false);
  });

  it('rejects a non-hex string', () => {
    expect(objectIdSchema.safeParse('zzzzzzzzzzzzzzzzzzzzzzzz').success).toBe(false);
  });
});

describe('nameSchema', () => {
  it('accepts a valid name within limit', () => {
    expect(nameSchema(30).safeParse('My Name').success).toBe(true);
  });

  it('rejects empty string', () => {
    expect(nameSchema(30).safeParse('').success).toBe(false);
  });

  it('rejects a name over the max length', () => {
    expect(nameSchema(5).safeParse('TooLong').success).toBe(false);
  });
});

describe('amountSchema', () => {
  it('accepts a valid positive amount', () => {
    expect(amountSchema.safeParse(100).success).toBe(true);
  });

  it('accepts a valid negative amount', () => {
    expect(amountSchema.safeParse(-50).success).toBe(true);
  });

  it('rejects zero', () => {
    expect(amountSchema.safeParse(0).success).toBe(false);
  });

  it('rejects amount above range', () => {
    expect(amountSchema.safeParse(1_000_000_000).success).toBe(false);
  });

  it('rejects amount below range', () => {
    expect(amountSchema.safeParse(-1_000_000_000).success).toBe(false);
  });
});

describe('positiveAmountSchema', () => {
  it('accepts a positive amount', () => {
    expect(positiveAmountSchema.safeParse(0.01).success).toBe(true);
  });

  it('rejects zero', () => {
    expect(positiveAmountSchema.safeParse(0).success).toBe(false);
  });

  it('rejects negative', () => {
    expect(positiveAmountSchema.safeParse(-1).success).toBe(false);
  });

  it('rejects amount above range', () => {
    expect(positiveAmountSchema.safeParse(1_000_000_000).success).toBe(false);
  });
});
