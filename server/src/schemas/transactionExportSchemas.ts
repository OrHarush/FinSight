import { z } from 'zod';

export const ExportTransactionsSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be YYYY-MM'),
  })
  .transform(({ month }) => {
    const [yearStr, monthStr] = month.split('-');
    const targetYear = parseInt(yearStr, 10);
    const targetMonth = parseInt(monthStr, 10) - 1;

    const from = new Date(Date.UTC(targetYear, targetMonth, 1));
    const to = new Date(Date.UTC(targetYear, targetMonth + 2, 0, 23, 59, 59, 999));

    return { targetYear, targetMonth, from, to, monthLabel: month };
  });

export type ExportTransactionsQuery = z.infer<typeof ExportTransactionsSchema>;
