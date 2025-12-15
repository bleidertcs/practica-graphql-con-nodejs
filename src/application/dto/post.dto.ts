/**
 * Post DTO - Data Transfer Object for API responses
 */
export interface PostDto {
  id: number;
  title: string;
  author_id: number;
  description: string | null;
  content: string | null;
  date: string; // ISO date string
}

/**
 * Response type for post list queries
 */
export interface PostsResponse {
  list: PostDto[];
  count: number;
}
