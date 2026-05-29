import { z } from 'zod';

export const approveUserSchema = z.object({
  access: z.enum(['edit', 'view'], {
    message: 'Access must be "edit" or "view"',
  }),
});

export type ApproveUserInput = z.infer<typeof approveUserSchema>;
