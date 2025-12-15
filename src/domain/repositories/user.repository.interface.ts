import type { User } from '../entities/user.entity.js';

/**
 * Input for creating a user
 */
export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
}

/**
 * User Repository Interface
 */
export interface IUserRepository {
  /**
   * Find user by ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(input: CreateUserInput): Promise<User>;
}
