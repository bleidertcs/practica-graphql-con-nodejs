import DataLoader from 'dataloader';
import { Knex } from 'knex';
import { Author } from '../dto/author.js';
import { Post } from '../dto/post.js';
import { toDto as toAuthorDto } from '../mappers/author.mapper.js';
import { toDtoList as toPostDtoList } from '../mappers/post.mapper.js';
import { AuthorDto } from '../dto/author-dto.js';
import { PostDto } from '../dto/post-dto.js';

const authorById = async (knex: Knex, ids: readonly number[]): Promise<(AuthorDto | Error)[]> => {
  const authors: Author[] = await knex('authors').select('*').whereIn('id', ids);
  const results = ids.map(id => {
      const author = authors.find(author => author.id === id);
      return author ? toAuthorDto(author) : new Error(`Author ${id} not found`);
  });
  return results;
};

const postsByAuthorId = async (knex: Knex, authorIds: readonly number[]): Promise<PostDto[][]> => {
  const posts: Post[] = await knex('posts').select('*').whereIn('author_id', authorIds);
  const results = authorIds.map(id => {
    const authorPosts = posts.filter(post => post.author_id === id);
    return toPostDtoList(authorPosts);
  });
  return results;
};

export const createDataLoaders = (knex: Knex) => ({
  authorById: new DataLoader<number, AuthorDto>(async (ids: readonly number[]) => authorById(knex, ids)),
  postsByAuthorId: new DataLoader<number, PostDto[]>(async (ids: readonly number[]) => postsByAuthorId(knex, ids)),
});
