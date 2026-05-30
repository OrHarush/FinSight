import { z } from 'zod';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export const CreateWorkspaceSchema = z.object({
  name: z
    .string({ required_error: 'validation.required' })
    .trim()
    .min(1, 'validation.required')
    .max(40, 'validation.nameTooLong'),
  currency: z
    .string()
    .trim()
    .length(3, 'validation.currencyLength')
    .optional(),
  icon: z.string().trim().max(40, 'validation.iconTooLong').optional(),
  color: z.string().trim().regex(HEX_COLOR, 'validation.colorInvalid').optional(),
});

export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceSchema>;

export const UpdateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'validation.required')
      .max(40, 'validation.nameTooLong')
      .optional(),
    icon: z.string().trim().max(40, 'validation.iconTooLong').optional(),
    color: z.string().trim().regex(HEX_COLOR, 'validation.colorInvalid').optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({ code: 'custom', message: 'validation.required' });
    }
  });

export type UpdateWorkspaceDTO = z.infer<typeof UpdateWorkspaceSchema>;

export const CreateInvitationSchema = z.object({
  invitedEmail: z
    .string({ required_error: 'validation.required' })
    .trim()
    .toLowerCase()
    .email('validation.emailInvalid'),
});

export type CreateInvitationDTO = z.infer<typeof CreateInvitationSchema>;
