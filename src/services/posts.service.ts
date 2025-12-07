import type { Knex } from 'knex';
import { getPosts, getPostsCount, getPostsByAuthor, getPostsByAuthorCount } from '../common.js';
import type { Post } from '../dto/post.js';
import { QueryArgs } from '../dto/query-args.js';
import { toDtoList } from '../mappers/post.mapper.js';
import type { PostDto } from '../dto/post-dto.js';

export const listPosts = async (
    db: Knex,
    args: QueryArgs,
): Promise<PostDto[]> => {
    const queryArgs: QueryArgs = {
        id: args.id,
        limit: args.limit ?? 20,
        offset: args.offset,
    };
    const rows: Post[] = await getPosts(db, queryArgs);
    return toDtoList(rows);
};

export const countPosts = async (db: Knex): Promise<number> => {
    return await getPostsCount(db);
};

export const listPostsByAuthor = async (
    db: Knex,
    authorId: number,
): Promise<PostDto[]> => {
    const rows: Post[] = await getPostsByAuthor(db, authorId);
    return toDtoList(rows);
};

export const countPostsByAuthor = async (
    db: Knex,
    authorId: number,
): Promise<number> => {
    return await getPostsByAuthorCount(db, authorId);
};