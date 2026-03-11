import { z } from 'zod';

export const GetTransactionsSchema = z
  .object({
    page: z.string().regex(/^\d+$/, 'page must be a number').optional().default('1'),
    limit: z.string().regex(/^\d+$/, 'limit must be a number').optional(),
    sort: z.enum(['asc', 'desc']).optional().default('desc'),
    categoryId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    accountId: z.string().optional(),
    year: z
      .string()
      .regex(/^\d{4}$/, 'year must be a 4-digit number')
      .optional(),
    month: z
      .string()
      .regex(/^(1[0-2]|[1-9])$/, 'month must be between 1 and 12')
      .optional(),
    search: z.string().optional(),
  })
  .transform((data) => {
    const year = data.year ? parseInt(data.year, 10) : undefined;
    const month = data.month ? parseInt(data.month, 10) - 1 : undefined;
    const page = parseInt(data.page, 10);
    const limit = data.limit ? parseInt(data.limit, 10) : undefined;

    let from: Date | undefined;
    let to: Date | undefined;

    if (year !== undefined && month !== undefined) {
      from = new Date(Date.UTC(year, month, 1));
      to = new Date(Date.UTC(year, month + 2, 0, 23, 59, 59, 999));
    }

    return {
      page,
      limit,
      sort: (data.sort || 'desc') as 'asc' | 'desc',
      categoryId: data.categoryId,
      paymentMethodId: data.paymentMethodId,
      accountId: data.accountId,
      from,
      to,
      targetYear: year,
      // month is 0-indexed to match JS Date convention (0 = January)
      targetMonth: month,
      search: data.search,
    };
  });

export type GetTransactionsQuery = z.infer<typeof GetTransactionsSchema>;

// Partial version for internal callers (chat, MCP) that build options programmatically
export type GetTransactionsOptions = Partial<GetTransactionsQuery>;

export const GetTransactionSummarySchema = z
  .object({
    year: z.string().regex(/^\d{4}$/, 'year must be a 4-digit number'),
    month: z
      .string()
      .regex(/^(1[0-2]|[1-9])$/, 'month must be between 1 and 12')
      .optional(),
    accountId: z.string().optional(),
  })
  .transform((data) => ({
    year: parseInt(data.year, 10),
    month: data.month ? parseInt(data.month, 10) - 1 : undefined,
    accountId: data.accountId,
  }));

export type GetTransactionSummaryQuery = z.infer<typeof GetTransactionSummarySchema>;
