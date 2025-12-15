import type { Post } from '../../domain/entities/post.entity.js';
import type { PostDto } from '../dto/post.dto.js';

/**
 * Convert Date to ISO string safely
 */
const toISOString = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
};

/**
 * Map Post domain entity to PostDto
 */
export const toPostDto = (post: Post): PostDto => ({
  id: post.id,
  title: post.title,
  author_id: post.authorId,
  description: post.description,
  content: post.content,
  date: toISOString(post.date),
});

/**
 * Map array of Post entities to PostDto array
 */
export const toPostDtoList = (posts: Post[]): PostDto[] =>
  posts.map(toPostDto);
