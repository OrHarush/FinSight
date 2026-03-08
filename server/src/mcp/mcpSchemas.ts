import { z } from 'zod';

export const TransactionQuerySchema = z.object({
  page: z.number().int().positive().optional().describe('Page number (1-based). Default is 1.'),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Max transactions per page. Omit for all results.'),
  from: z
    .string()
    .pipe(z.iso.datetime())
    .optional()
    .describe('Start date filter (ISO 8601). Example: "2026-01-01T00:00:00.000Z"'),
  to: z
    .string()
    .pipe(z.iso.datetime())
    .optional()
    .describe('End date filter (ISO 8601). Example: "2026-01-31T23:59:59.999Z"'),
  targetYear: z
    .number()
    .int()
    .optional()
    .describe(
      'Filter transactions effective in this year (handles recurring transactions correctly)'
    ),
  targetMonth: z
    .number()
    .int()
    .min(0)
    .max(11)
    .optional()
    .describe(
      'Filter transactions effective in this month (0=Jan, 11=Dec). Must be used together with targetYear.'
    ),
  sort: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Sort order by date. Default is desc (newest first).'),
  type: z
    .enum(['Income', 'Expense', 'Transfer'])
    .optional()
    .describe(
      'Filter by transaction type. Income = money received, Expense = money spent, Transfer = money moved between accounts.'
    ),
  recurrence: z
    .enum(['None', 'Monthly', 'Yearly'])
    .optional()
    .describe(
      'Filter by recurrence pattern. None = one-time, Monthly = repeats every month, Yearly = repeats every year.'
    ),
  categoryId: z
    .string()
    .optional()
    .describe('Filter by category ID. Use getCategories to find category IDs.'),
  paymentMethodId: z
    .string()
    .optional()
    .describe('Filter by payment method ID. Use getPaymentMethods to find IDs.'),
  accountId: z
    .string()
    .optional()
    .describe(
      'Filter by account ID — matches transactions where account, fromAccount, or toAccount equals this ID.'
    ),
  fromAccountId: z
    .string()
    .optional()
    .describe(
      'Filter by transfer source account ID. Only relevant for Transfer type transactions.'
    ),
  toAccountId: z
    .string()
    .optional()
    .describe(
      'Filter by transfer destination account ID. Only relevant for Transfer type transactions.'
    ),
  search: z
    .string()
    .optional()
    .describe('Search by transaction name (case-insensitive substring match).'),
});

export const TransactionSummaryQuerySchema = z.object({
  year: z.number().int().describe('Year to summarize (required). Example: 2026'),
  month: z
    .number()
    .int()
    .min(0)
    .max(11)
    .optional()
    .describe(
      'Month to summarize (0=Jan, 11=Dec). If omitted, returns a full yearly breakdown with all 12 months.'
    ),
  accountId: z
    .string()
    .optional()
    .describe('Scope the summary to a specific account ID. If omitted, summarizes all accounts.'),
});

export const AccountQuerySchema = z.object({
  isPrimary: z
    .boolean()
    .optional()
    .describe(
      'If true, returns only the primary account (the main bank account used for balance calculations).'
    ),
  search: z
    .string()
    .optional()
    .describe('Search by account name or institution (case-insensitive substring match).'),
});

export const CategoryQuerySchema = z.object({
  type: z
    .enum(['Income', 'Expense'])
    .optional()
    .describe(
      'Filter by category type. Income categories are for salary/revenue, Expense categories are for spending.'
    ),
  search: z
    .string()
    .optional()
    .describe('Search by category name (case-insensitive substring match).'),
});

export const PaymentMethodQuerySchema = z.object({
  type: z
    .enum(['Credit', 'Debit', 'BankTransfer', 'PayPal', 'Other'])
    .optional()
    .describe(
      'Filter by payment method type. Credit = credit card (has billing day), Debit = debit card, BankTransfer = wire/bank transfer, PayPal, Other.'
    ),
  isPrimary: z.boolean().optional().describe('If true, returns only the primary payment method.'),
  search: z
    .string()
    .optional()
    .describe('Search by payment method name (case-insensitive substring match).'),
});

export const BudgetQuerySchema = z.object({
  year: z.number().int().optional().describe('Filter budgets by year. Example: 2026'),
  month: z
    .number()
    .int()
    .min(1)
    .max(12)
    .optional()
    .describe(
      'Filter budgets by month (1=Jan, 12=Dec). Note: stored internally as 0-11 but this input uses 1-12.'
    ),
  categoryId: z
    .string()
    .optional()
    .describe('Filter budgets for a specific category ID. Use getCategories to find category IDs.'),
});
