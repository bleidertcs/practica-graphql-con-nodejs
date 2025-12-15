import type { Author } from '../../domain/entities/author.entity.js';
import type { AuthorDto } from '../dto/author.dto.js';

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
 * Map Author domain entity to AuthorDto
 */
export const toAuthorDto = (author: Author): AuthorDto => ({
  id: author.id,
  first_name: author.firstName,
  last_name: author.lastName,
  email: author.email,
  birthdate: toISOString(author.birthdate),
  added: toISOString(author.added),
});

/**
 * Map array of Author entities to AuthorDto array
 */
export const toAuthorDtoList = (authors: Author[]): AuthorDto[] =>
  authors.map(toAuthorDto);
