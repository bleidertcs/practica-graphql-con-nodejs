import type { Author } from '../dto/author.js';
import type { AuthorDto } from '../dto/author-dto.js';

export const toDto = (a: Author): AuthorDto => ({
    id: a.id,
    first_name: a.first_name,
    last_name: a.last_name,
    email: a.email,
    birthdate: a.birthdate instanceof Date ? a.birthdate.toISOString() : new Date(a.birthdate).toISOString(),
    added: a.added instanceof Date ? a.added.toISOString() : new Date(a.added).toISOString(),
});

export const toDtoList = (list: Author[]): AuthorDto[] => list.map(toDto);
