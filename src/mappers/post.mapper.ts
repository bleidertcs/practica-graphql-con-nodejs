import type { Post } from '../dto/post.js';
import type { PostDto } from '../dto/post-dto.js';

export const toDto = (p: Post): PostDto => ({
    id: p.id,
    title: p.title,
    author_id: p.author_id,
    description: p.description,
    content: p.content,
    date: p.date instanceof Date ? p.date.toISOString() : new Date(p.date).toISOString(),
});

export const toDtoList = (list: Post[]): PostDto[] => list.map(toDto);
