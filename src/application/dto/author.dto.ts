/**
 * Author DTO - Data Transfer Object for API responses
 */
export interface AuthorDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string; // ISO date string
  added: string; // ISO date string
}

/**
 * Response type for author list queries
 */
export interface AuthorsResponse {
  list: AuthorDto[];
  count: number;
}
