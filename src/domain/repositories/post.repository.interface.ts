import type { Post } from '../entities/post.entity.js';

/**
 * Query options for listing posts
 */
export interface ListPostsOptions {
  id?: number;
  limit?: number;
  offset?: number;
}

/**
 * Input for creating a post
 */
export interface CreatePostInput {
  title: string;
  authorId: number;
  description: string | null;
  content: string | null;
}

/**
 * Input for updating a post (all fields optional)
 */
export interface UpdatePostInput {
  title?: string;
  description?: string | null;
  content?: string | null;
}

/**
 * Post Repository Interface
 * Defines the contract for data access without implementation details
 */
export interface IPostRepository {
  /**
   * Find posts with optional filtering and pagination
   */
  findAll(options: ListPostsOptions): Promise<Post[]>;

  /**
   * Find a single post by ID
   */
  findById(id: number): Promise<Post | null>;

  /**
   * Find all posts by author ID
   */
  findByAuthorId(authorId: number): Promise<Post[]>;

  /**
   * Find posts by multiple author IDs (for DataLoader)
   */
  findByAuthorIds(authorIds: number[]): Promise<Map<number, Post[]>>;

  /**
   * Count total posts
   */
  count(): Promise<number>;

  /**
   * Count posts by author
   */
  countByAuthorId(authorId: number): Promise<number>;

  /**
   * Create a new post
   */
  create(input: CreatePostInput): Promise<Post>;

  /**
   * Update an existing post
   */
  update(id: number, input: UpdatePostInput): Promise<Post>;

  /**
   * Delete a post by ID
   */
  delete(id: number): Promise<void>;
}
