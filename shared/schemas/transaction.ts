import { z } from 'zod';

import { amountSchema, nameSchema, objectIdSchema } from './common';

export const CreateTransactionSchema = z
  .object({
    name: nameSchema(50).optional(),
    description: z
      .string()
      .max(120, 'validation.nameTooLong')
      .trim()
      .optional(),
    type: z.enum(['Income', 'Expense', 'Transfer']),
    amount: amountSchema,
    recurrence: z.enum(['None', 'Monthly', 'Yearly']),
    belongToPreviousMonth: z.boolean().optional(),
    date: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    categoryId: objectIdSchema.optional(),
    accountId: objectIdSchema.optional(),
    fromAccountId: objectIdSchema.optional(),
    toAccountId: objectIdSchema.optional(),
    paymentMethodId: objectIdSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // Date rules
    if (data.recurrence === 'None') {
      if (!data.date) {
        ctx.addIssue({
          path: ['date'],
          code: 'custom',
          message: 'validation.dateRequired',
        });
      }
    } else {
      if (!data.startDate) {
        ctx.addIssue({
          path: ['startDate'],
          code: 'custom',
          message: 'validation.startDateRequired',
        });
      }
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) <= new Date(data.startDate)
      ) {
        ctx.addIssue({
          path: ['endDate'],
          code: 'custom',
          message: 'validation.endDateAfterStart',
        });
      }
    }

    // Type rules
    if (data.type === 'Transfer') {
      if (!data.fromAccountId) {
        ctx.addIssue({
          path: ['fromAccountId'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (!data.toAccountId) {
        ctx.addIssue({
          path: ['toAccountId'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (
        data.fromAccountId &&
        data.toAccountId &&
        data.fromAccountId === data.toAccountId
      ) {
        ctx.addIssue({
          path: ['toAccountId'],
          code: 'custom',
          message: 'validation.transferSameAccount',
        });
      }
      if (data.categoryId) {
        ctx.addIssue({
          path: ['categoryId'],
          code: 'custom',
          message: 'validation.transferRequiresAccounts',
        });
      }
    }

    if (data.type === 'Income' || data.type === 'Expense') {
      if (!data.accountId) {
        ctx.addIssue({
          path: ['accountId'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (!data.categoryId) {
        ctx.addIssue({
          path: ['categoryId'],
          code: 'custom',
          message: 'validation.categoryRequired',
        });
      }
    }
  });

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;
export type TransactionType = CreateTransactionDTO['type'];

export const UpdateTransactionSchema = z
  .object({
    name: nameSchema(50).optional(),
    description: z
      .string()
      .max(120, 'validation.nameTooLong')
      .trim()
      .optional(),
    type: z.enum(['Income', 'Expense', 'Transfer']).optional(),
    amount: amountSchema.optional(),
    recurrence: z.enum(['None', 'Monthly', 'Yearly']).optional(),
    belongToPreviousMonth: z.boolean().optional(),
    date: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    categoryId: objectIdSchema.optional(),
    accountId: objectIdSchema.optional(),
    fromAccountId: objectIdSchema.optional(),
    toAccountId: objectIdSchema.optional(),
    paymentMethodId: objectIdSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate) <= new Date(data.startDate)
    ) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'validation.endDateAfterStart',
      });
    }

    if (
      data.fromAccountId &&
      data.toAccountId &&
      data.fromAccountId === data.toAccountId
    ) {
      ctx.addIssue({
        path: ['toAccountId'],
        code: 'custom',
        message: 'validation.transferSameAccount',
      });
    }
  });

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;

// ── Form schema (field names match the React form / UI) ───────────────────────

export const TransactionFormSchema = z
  .object({
    name: nameSchema(50).optional(),
    amount: amountSchema,
    date: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    recurrence: z.enum(['None', 'Monthly', 'Yearly']),
    belongToPreviousMonth: z.boolean().optional(),
    type: z.enum(['Income', 'Expense', 'Transfer']),
    category: objectIdSchema.optional(),
    paymentMethod: objectIdSchema.optional(),
    account: objectIdSchema.optional(),
    fromAccount: objectIdSchema.optional(),
    toAccount: objectIdSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurrence === 'None') {
      if (!data.date) {
        ctx.addIssue({
          path: ['date'],
          code: 'custom',
          message: 'validation.dateRequired',
        });
      }
    } else {
      if (!data.startDate) {
        ctx.addIssue({
          path: ['startDate'],
          code: 'custom',
          message: 'validation.startDateRequired',
        });
      }
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) <= new Date(data.startDate)
      ) {
        ctx.addIssue({
          path: ['endDate'],
          code: 'custom',
          message: 'validation.endDateAfterStart',
        });
      }
    }

    if (data.type === 'Transfer') {
      if (!data.fromAccount) {
        ctx.addIssue({
          path: ['fromAccount'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (!data.toAccount) {
        ctx.addIssue({
          path: ['toAccount'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (
        data.fromAccount &&
        data.toAccount &&
        data.fromAccount === data.toAccount
      ) {
        ctx.addIssue({
          path: ['toAccount'],
          code: 'custom',
          message: 'validation.transferSameAccount',
        });
      }
    }

    if (data.type === 'Income' || data.type === 'Expense') {
      if (!data.account) {
        ctx.addIssue({
          path: ['account'],
          code: 'custom',
          message: 'validation.accountRequired',
        });
      }
      if (!data.category) {
        ctx.addIssue({
          path: ['category'],
          code: 'custom',
          message: 'validation.categoryRequired',
        });
      }
    }
  });

export type TransactionFormValues = z.infer<typeof TransactionFormSchema>;
