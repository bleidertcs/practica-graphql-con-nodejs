import DataLoader from 'dataloader';
import type { Knex } from 'knex';
import type { Author } from '../../../../domain/entities/author.entity.js';
import type { Post } from '../../../../domain/entities/post.entity.js';
import { KnexAuthorRepository } from '../../../database/repositories/knex-author.repository.js';
import { KnexPostRepository } from '../../../database/repositories/knex-post.repository.js';
import { toAuthorDto } from '../../../../application/mappers/author.mapper.js';
import { toPostDtoList } from '../../../../application/mappers/post.mapper.js';
import type { AuthorDto } from '../../../../application/dto/author.dto.js';
import type { PostDto } from '../../../../application/dto/post.dto.js';

/**
 * Type for data loaders
 */
export interface DataLoaders {
  authorById: DataLoader<number, AuthorDto | Error>;
  postsByAuthorId: DataLoader<number, PostDto[]>;
}

/**
 * Create DataLoaders for batching and caching
 */
export function createDataLoaders(db: Knex): DataLoaders {
  const authorRepository = new KnexAuthorRepository(db);
  const postRepository = new KnexPostRepository(db);

  return {
    /**
     * Batch load authors by IDs
     */
    authorById: new DataLoader<number, AuthorDto | Error>(async (ids) => {
      const authors = await authorRepository.findByIds([...ids]);
      const authorMap = new Map<number, Author>();
      
      for (const author of authors) {
        authorMap.set(author.id, author);
      }

      return ids.map(id => {
        const author = authorMap.get(id);
        return author ? toAuthorDto(author) : new Error(`Author ${id} not found`);
      });
    }),

    /**
     * Batch load posts by author IDs
     */
    postsByAuthorId: new DataLoader<number, PostDto[]>(async (authorIds) => {
      const postsMap = await postRepository.findByAuthorIds([...authorIds]);
      
      return authorIds.map(authorId => {
        const posts = postsMap.get(authorId) ?? [];
        return toPostDtoList(posts);
      });
    }),
  };
}
