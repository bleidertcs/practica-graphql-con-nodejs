import { ListPostsUseCase } from '../../src/application/use-cases/posts/list-posts.use-case.js';
import { GetPostByIdUseCase } from '../../src/application/use-cases/posts/get-post-by-id.use-case.js';
import { ListPostsByAuthorUseCase } from '../../src/application/use-cases/posts/list-posts-by-author.use-case.js';
import { CountPostsUseCase } from '../../src/application/use-cases/posts/count-posts.use-case.js';
import { EntityNotFoundError } from '../../src/domain/errors/domain-errors.js';
import type { IPostRepository } from '../../src/domain/repositories/post.repository.interface.js';
import type { Post } from '../../src/domain/entities/post.entity.js';

// Mock data
const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  authorId: 1,
  description: 'A test post description',
  content: 'Full content of the test post',
  date: new Date('2023-06-15'),
};

const mockPosts: Post[] = [
  mockPost,
  {
    id: 2,
    title: 'Another Post',
    authorId: 1,
    description: 'Another description',
    content: 'Another content',
    date: new Date('2023-06-20'),
  },
];

// Mock repository factory
function createMockPostRepository(overrides?: Partial<IPostRepository>): IPostRepository {
  return {
    findAll: jest.fn().mockResolvedValue(mockPosts),
    findById: jest.fn().mockResolvedValue(mockPost),
    findByAuthorId: jest.fn().mockResolvedValue(mockPosts),
    findByAuthorIds: jest.fn().mockResolvedValue(new Map([[1, mockPosts]])),
    count: jest.fn().mockResolvedValue(50),
    countByAuthorId: jest.fn().mockResolvedValue(2),
    create: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue(mockPost),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('ListPostsUseCase', () => {
  it('should return list of posts with count', async () => {
    const mockRepo = createMockPostRepository();
    const useCase = new ListPostsUseCase(mockRepo);

    const result = await useCase.execute({ limit: 10 });

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(50);
    expect(result.list[0].title).toBe('Test Post');
    expect(result.list[0].author_id).toBe(1);
  });

  it('should apply default pagination', async () => {
    const mockRepo = createMockPostRepository();
    const useCase = new ListPostsUseCase(mockRepo);

    await useCase.execute({});

    expect(mockRepo.findAll).toHaveBeenCalledWith({
      id: undefined,
      limit: 20,
      offset: 0,
    });
  });
});

describe('GetPostByIdUseCase', () => {
  it('should return post when found', async () => {
    const mockRepo = createMockPostRepository();
    const useCase = new GetPostByIdUseCase(mockRepo);

    const result = await useCase.execute(1);

    expect(result.id).toBe(1);
    expect(result.title).toBe('Test Post');
  });

  it('should throw EntityNotFoundError when post not found', async () => {
    const mockRepo = createMockPostRepository({
      findById: jest.fn().mockResolvedValue(null),
    });
    const useCase = new GetPostByIdUseCase(mockRepo);

    await expect(useCase.execute(999)).rejects.toThrow(EntityNotFoundError);
  });
});

describe('ListPostsByAuthorUseCase', () => {
  it('should return posts by author with count', async () => {
    const mockRepo = createMockPostRepository();
    const useCase = new ListPostsByAuthorUseCase(mockRepo);

    const result = await useCase.execute(1);

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(mockRepo.findByAuthorId).toHaveBeenCalledWith(1);
    expect(mockRepo.countByAuthorId).toHaveBeenCalledWith(1);
  });
});

describe('CountPostsUseCase', () => {
  it('should return total count', async () => {
    const mockRepo = createMockPostRepository();
    const useCase = new CountPostsUseCase(mockRepo);

    const result = await useCase.execute();

    expect(result).toBe(50);
  });
});
