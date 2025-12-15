import { ListAuthorsUseCase } from '../../src/application/use-cases/authors/list-authors.use-case.js';
import { GetAuthorByIdUseCase } from '../../src/application/use-cases/authors/get-author-by-id.use-case.js';
import { CountAuthorsUseCase } from '../../src/application/use-cases/authors/count-authors.use-case.js';
import { EntityNotFoundError } from '../../src/domain/errors/domain-errors.js';
import type { IAuthorRepository } from '../../src/domain/repositories/author.repository.interface.js';
import type { Author } from '../../src/domain/entities/author.entity.js';

// Mock data
const mockAuthor: Author = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  birthdate: new Date('1990-01-15'),
  added: new Date('2023-01-01'),
};

const mockAuthors: Author[] = [
  mockAuthor,
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    birthdate: new Date('1985-05-20'),
    added: new Date('2023-02-01'),
  },
];

// Mock repository factory
function createMockAuthorRepository(overrides?: Partial<IAuthorRepository>): IAuthorRepository {
  return {
    findAll: jest.fn().mockResolvedValue(mockAuthors),
    findById: jest.fn().mockResolvedValue(mockAuthor),
    findByIds: jest.fn().mockResolvedValue(mockAuthors),
    count: jest.fn().mockResolvedValue(100),
    create: jest.fn().mockResolvedValue(mockAuthor),
    update: jest.fn().mockResolvedValue(mockAuthor),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('ListAuthorsUseCase', () => {
  it('should return list of authors with count', async () => {
    const mockRepo = createMockAuthorRepository();
    const useCase = new ListAuthorsUseCase(mockRepo);

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(100);
    expect(result.list[0].first_name).toBe('John');
    expect(result.list[0].last_name).toBe('Doe');
  });

  it('should apply default pagination', async () => {
    const mockRepo = createMockAuthorRepository();
    const useCase = new ListAuthorsUseCase(mockRepo);

    await useCase.execute({});

    expect(mockRepo.findAll).toHaveBeenCalledWith({
      id: undefined,
      limit: 20,
      offset: 0,
    });
  });

  it('should pass id filter when provided', async () => {
    const mockRepo = createMockAuthorRepository();
    const useCase = new ListAuthorsUseCase(mockRepo);

    await useCase.execute({ id: 5 });

    expect(mockRepo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ id: 5 })
    );
  });
});

describe('GetAuthorByIdUseCase', () => {
  it('should return author when found', async () => {
    const mockRepo = createMockAuthorRepository();
    const useCase = new GetAuthorByIdUseCase(mockRepo);

    const result = await useCase.execute(1);

    expect(result.id).toBe(1);
    expect(result.first_name).toBe('John');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw EntityNotFoundError when author not found', async () => {
    const mockRepo = createMockAuthorRepository({
      findById: jest.fn().mockResolvedValue(null),
    });
    const useCase = new GetAuthorByIdUseCase(mockRepo);

    await expect(useCase.execute(999)).rejects.toThrow(EntityNotFoundError);
  });
});

describe('CountAuthorsUseCase', () => {
  it('should return total count', async () => {
    const mockRepo = createMockAuthorRepository();
    const useCase = new CountAuthorsUseCase(mockRepo);

    const result = await useCase.execute();

    expect(result).toBe(100);
    expect(mockRepo.count).toHaveBeenCalled();
  });
});
