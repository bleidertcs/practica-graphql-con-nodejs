import { Knex } from 'knex';
import { QueryArgs } from './dto/query-args.js';

import * as authorsService from './services/authors.service.js';
import * as postsService from './services/posts.service.js';
import { validateGraphQLArgs } from './middleware/graphql-validate.js';
import { createDataLoaders } from './services/data-loaders.service.js';
import { AuthorDto } from './dto/author-dto.js';
import { PostDto } from './dto/post-dto.js';

export const Authors = async ({ id, limit, offset }: QueryArgs, db: Knex) => {
  validateGraphQLArgs({ id, limit, offset });
  const list = await authorsService.listAuthors(db, { id, limit, offset });
  const count = await authorsService.countAuthors(db);
  return { list, count };
};

export const Posts = async ({ id, limit, offset }: QueryArgs, db: Knex) => {
  validateGraphQLArgs({ id, limit, offset });
  const list = await postsService.listPosts(db, { id, limit, offset });
  const count = await postsService.countPosts(db);
  return { list, count };
};

export const Post = {
  author: async (
    post: PostDto,
    _: any,
    { dataLoaders }: { dataLoaders: ReturnType<typeof createDataLoaders> },
  ) => {
    const authorDto = await dataLoaders.authorById.load(post.author_id);
    if (authorDto instanceof Error) {
      return null;
    }
    return authorDto;
  },
};

export const Author = {
  posts: async (
    author: AuthorDto,
    _: any,
    { dataLoaders }: { dataLoaders: ReturnType<typeof createDataLoaders> },
  ) => {
    const postDtos = await dataLoaders.postsByAuthorId.load(author.id);
    return postDtos;
  },
};