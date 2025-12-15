import type { Author } from '../entities/author.entity.js';

/**
 * Query options for listing authors
 */
export interface ListAuthorsOptions {
  id?: number;
  limit?: number;
  offset?: number;
}

/**
 * Input for creating an author
 */
export interface CreateAuthorInput {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
}

/**
 * Input for updating an author (all fields optional)
 */
export interface UpdateAuthorInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: Date;
}

/**
 * Author Repository Interface
 * Defines the contract for data access without implementation details
 */
export interface IAuthorRepository {
  /**
   * Find authors with optional filtering and pagination
   */
  findAll(options: ListAuthorsOptions): Promise<Author[]>;

  /**
   * Find a single author by ID
   */
  findById(id: number): Promise<Author | null>;

  /**
   * Find multiple authors by IDs (for DataLoader)
   */
  findByIds(ids: number[]): Promise<Author[]>;

  /**
   * Count total authors
   */
  count(): Promise<number>;

  /**
   * Create a new author
   */
  create(input: CreateAuthorInput): Promise<Author>;

  /**
   * Update an existing author
   */
  update(id: number, input: UpdateAuthorInput): Promise<Author>;

  /**
   * Delete an author by ID
   */
  delete(id: number): Promise<void>;
}
