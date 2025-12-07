import logger from './utils/logger.js';
import { Knex } from 'knex';
import { QueryArgs } from './dto/query-args.js';
import type { Author } from './dto/author.js';
import type { Post } from './dto/post.js';

const log = logger;

const applyPaginationAndFiltering = (query: Knex.QueryBuilder, { id, limit, offset }: QueryArgs, whereClause?: Record<string, any>) => {
  if (whereClause) {
    query.where(whereClause);
  }
  if (typeof id !== 'undefined') {
    query.where({ id });
  }
  if (typeof limit !== 'undefined') {
    query.limit(limit);
  }
  if (typeof offset !== 'undefined') {
    query.offset(offset);
  }
  return query;
};

const getCount = async (knex: Knex, tableName: string, whereClause?: Record<string, any>): Promise<number> => {
  const query = knex(tableName).count({ count: '*' }).first();
  if (whereClause) {
    query.where(whereClause);
  }
  const result = await query;
  return Number(result?.count);
};

export const getAuthors = async (
  knex: Knex,
  { id, limit, offset }: QueryArgs,
): Promise<Author[]> => {
  log.debug(`getAuthors | id => ${id}`);
  const query = knex('authors').select('*').orderBy('first_name', 'last_name');
  return await applyPaginationAndFiltering(query, { id, limit, offset });
};

export const getAuthorsCount = async (
  knex: Knex,
): Promise<number> => {
  log.debug('getAuthorsCount');
  return getCount(knex, 'authors');
};

export const getPosts = async (

  knex: Knex,

  { id, limit, offset }: QueryArgs,

): Promise<Post[]> => {

  log.debug(`getPosts | id => ${id}`);

  const query = knex('posts').select('*');

  return await applyPaginationAndFiltering(query, { id, limit, offset });

};



export const getPostsByAuthor = async (

  knex: Knex,

  authorId: number,

): Promise<Post[]> => {

  log.debug(`getPostsByAuthor | authorId => ${authorId}`);

  return await knex('posts').select('*').where({ author_id: authorId });

};



export const getPostsCount = async (

  knex: Knex,

): Promise<number> => {

  log.debug('getPostsCount');

  return getCount(knex, 'posts');

};



export const getPostsByAuthorCount = async (

  knex: Knex,

  authorId: number,

): Promise<number> => {

  log.debug(`getPostsByAuthorCount | authorId => ${authorId}`);

  return getCount(knex, 'posts', { author_id: authorId });

};
