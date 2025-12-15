/**
 * Author Domain Entity
 * Pure domain entity without infrastructure dependencies
 */
export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  added: Date;
}

/**
 * Raw database row representation
 */
export interface AuthorRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  added: Date;
}
