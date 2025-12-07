import type { Knex } from 'knex';
import { getAuthors, getAuthorsCount } from '../common.js';
import type { Author } from '../dto/author.js';
import { QueryArgs } from '../dto/query-args.js';
import { toDtoList } from '../mappers/author.mapper.js';
import type { AuthorDto } from '../dto/author-dto.js';

export const listAuthors = async (
    db: Knex,
    args: QueryArgs,
): Promise<AuthorDto[]> => {
    const queryArgs: QueryArgs = {
        id: args.id,
        limit: args.limit ?? 20,
        offset: args.offset,
    };
    const rows: Author[] = await getAuthors(db, queryArgs);
    return toDtoList(rows);
};

export const countAuthors = async (db: Knex): Promise<number> => {
    return await getAuthorsCount(db);
};
