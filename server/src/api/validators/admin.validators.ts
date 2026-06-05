import { z } from 'zod';

export const approveUserSchema = z.object({
  access: z.enum(['edit', 'view'], {
    message: 'Access must be "edit" or "view"',
  }),
});

export type ApproveUserInput = z.infer<typeof approveUserSchema>;

export const createInventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  unit: z.string().optional(),
  pricing: z
    .array(
      z.object({
        price: z.number().nonnegative(),
        startDate: z.string().or(z.date()),
        endDate: z.string().or(z.date()).optional(),
      }),
    )
    .optional(),
});

export const addPricingSchema = z.object({
  price: z.number().nonnegative(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type AddPricingInput = z.infer<typeof addPricingSchema>;
