import { z } from 'zod';

export const ShareClickSchema = z.object({
  method: z.enum(['whatsapp', 'telegram', 'copy_link']).optional(),
});

export type ShareClickBody = z.infer<typeof ShareClickSchema>;
