import { z } from 'zod';

/**
 * Query arguments validation schema
 */
export const queryArgsSchema = z.object({
  id: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type QueryArgsSchema = z.infer<typeof queryArgsSchema>;

/**
 * Validate and parse query arguments
 */
export function validateQueryArgs<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}
