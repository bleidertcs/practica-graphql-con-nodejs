/**
 * User entity for authentication
 */
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/**
 * Raw user row from database (snake_case)
 */
export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}
