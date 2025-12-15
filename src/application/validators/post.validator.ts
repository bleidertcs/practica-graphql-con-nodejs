import { z } from 'zod';

/**
 * Post validation schemas
 */
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author_id: z.number().int().positive('Author ID must be positive'),
  description: z.string().max(500).nullable().optional(),
  content: z.string().nullable().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(500).nullable().optional(),
  content: z.string().nullable().optional(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
