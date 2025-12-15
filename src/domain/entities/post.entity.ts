/**
 * Post Domain Entity
 * Pure domain entity without infrastructure dependencies
 */
export interface Post {
  id: number;
  title: string;
  authorId: number;
  description: string | null;
  content: string | null;
  date: Date;
}

/**
 * Raw database row representation
 */
export interface PostRow {
  id: number;
  title: string;
  author_id: number;
  description: string | null;
  content: string | null;
  date: Date;
}
