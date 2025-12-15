import { z } from 'zod';

/**
 * Author validation schemas
 */
export const createAuthorSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format'),
  birthdate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date format'
  ),
});

export const updateAuthorSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email format').optional(),
  birthdate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date format'
  ).optional(),
});

export type CreateAuthorSchema = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorSchema = z.infer<typeof updateAuthorSchema>;
