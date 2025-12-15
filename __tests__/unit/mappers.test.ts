import { toAuthorDto, toAuthorDtoList } from '../../src/application/mappers/author.mapper.js';
import { toPostDto, toPostDtoList } from '../../src/application/mappers/post.mapper.js';
import type { Author } from '../../src/domain/entities/author.entity.js';
import type { Post } from '../../src/domain/entities/post.entity.js';

describe('Author Mapper', () => {
  const mockAuthor: Author = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    birthdate: new Date('1990-01-15T00:00:00.000Z'),
    added: new Date('2023-01-01T00:00:00.000Z'),
  };

  describe('toAuthorDto', () => {
    it('should map Author entity to AuthorDto', () => {
      const dto = toAuthorDto(mockAuthor);

      expect(dto.id).toBe(1);
      expect(dto.first_name).toBe('John');
      expect(dto.last_name).toBe('Doe');
      expect(dto.email).toBe('john@example.com');
      expect(dto.birthdate).toBe('1990-01-15T00:00:00.000Z');
      expect(dto.added).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should handle string dates', () => {
      const authorWithStringDates = {
        ...mockAuthor,
        birthdate: '1990-01-15T00:00:00.000Z' as any,
        added: '2023-01-01T00:00:00.000Z' as any,
      };

      const dto = toAuthorDto(authorWithStringDates);

      expect(dto.birthdate).toBe('1990-01-15T00:00:00.000Z');
    });
  });

  describe('toAuthorDtoList', () => {
    it('should map array of Author entities to AuthorDto array', () => {
      const authors: Author[] = [
        mockAuthor,
        { ...mockAuthor, id: 2, firstName: 'Jane' },
      ];

      const dtos = toAuthorDtoList(authors);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].first_name).toBe('John');
      expect(dtos[1].first_name).toBe('Jane');
    });

    it('should return empty array for empty input', () => {
      const dtos = toAuthorDtoList([]);
      expect(dtos).toHaveLength(0);
    });
  });
});

describe('Post Mapper', () => {
  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    authorId: 5,
    description: 'A description',
    content: 'Full content',
    date: new Date('2023-06-15T12:00:00.000Z'),
  };

  describe('toPostDto', () => {
    it('should map Post entity to PostDto', () => {
      const dto = toPostDto(mockPost);

      expect(dto.id).toBe(1);
      expect(dto.title).toBe('Test Post');
      expect(dto.author_id).toBe(5);
      expect(dto.description).toBe('A description');
      expect(dto.content).toBe('Full content');
      expect(dto.date).toBe('2023-06-15T12:00:00.000Z');
    });

    it('should handle null description and content', () => {
      const postWithNulls: Post = {
        ...mockPost,
        description: null,
        content: null,
      };

      const dto = toPostDto(postWithNulls);

      expect(dto.description).toBeNull();
      expect(dto.content).toBeNull();
    });
  });

  describe('toPostDtoList', () => {
    it('should map array of Post entities to PostDto array', () => {
      const posts: Post[] = [
        mockPost,
        { ...mockPost, id: 2, title: 'Second Post' },
      ];

      const dtos = toPostDtoList(posts);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].title).toBe('Test Post');
      expect(dtos[1].title).toBe('Second Post');
    });
  });
});
