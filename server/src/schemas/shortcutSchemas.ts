import { z } from 'zod';

export const ApproveSchema = z.object({
  code: z.string().min(1),
});

export const ShortcutTransactionSchema = z.object({
  amount: z.number().positive(),
  merchant: z.string().min(1),
  date: z.string(),
  categoryId: z.string().optional(),
  note: z.string().max(200).optional(),
});

export const ShortcutAndroidTransactionSchema = z.object({
  text: z.string().min(1),
  title: z.string().min(1),
  date: z.string().optional(),
});

export type ApproveDTO = z.infer<typeof ApproveSchema>;
export type ShortcutTransactionDTO = z.infer<typeof ShortcutTransactionSchema>;
export type ShortcutAndroidTransactionDTO = z.infer<typeof ShortcutAndroidTransactionSchema>;
