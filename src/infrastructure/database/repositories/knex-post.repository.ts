import type { Knex } from 'knex';
import type { Post, PostRow } from '../../../domain/entities/post.entity.js';
import type { 
  IPostRepository, 
  ListPostsOptions,
  CreatePostInput,
  UpdatePostInput,
} from '../../../domain/repositories/post.repository.interface.js';

/**
 * Knex implementation of IPostRepository
 */
export class KnexPostRepository implements IPostRepository {
  private readonly tableName = 'posts';

  constructor(private readonly db: Knex) {}

  /**
   * Map database row to domain entity
   */
  private toDomain(row: PostRow): Post {
    return {
      id: row.id,
      title: row.title,
      authorId: row.author_id,
      description: row.description,
      content: row.content,
      date: row.date,
    };
  }

  async findAll(options: ListPostsOptions): Promise<Post[]> {
    const query = this.db(this.tableName).select('*');

    if (typeof options.id !== 'undefined') {
      query.where({ id: options.id });
    }

    if (typeof options.limit !== 'undefined') {
      query.limit(options.limit);
    }

    if (typeof options.offset !== 'undefined') {
      query.offset(options.offset);
    }

    const rows = await query as PostRow[];
    return rows.map(row => this.toDomain(row));
  }

  async findById(id: number): Promise<Post | null> {
    const row = await this.db(this.tableName)
      .select('*')
      .where({ id })
      .first() as PostRow | undefined;

    return row ? this.toDomain(row) : null;
  }

  async findByAuthorId(authorId: number): Promise<Post[]> {
    const rows = await this.db(this.tableName)
      .select('*')
      .where({ author_id: authorId }) as PostRow[];

    return rows.map(row => this.toDomain(row));
  }

  async findByAuthorIds(authorIds: number[]): Promise<Map<number, Post[]>> {
    if (authorIds.length === 0) return new Map();

    const rows = await this.db(this.tableName)
      .select('*')
      .whereIn('author_id', authorIds) as PostRow[];

    const result = new Map<number, Post[]>();
    
    // Initialize empty arrays for all requested author IDs
    for (const authorId of authorIds) {
      result.set(authorId, []);
    }

    // Group posts by author
    for (const row of rows) {
      const posts = result.get(row.author_id) ?? [];
      posts.push(this.toDomain(row));
      result.set(row.author_id, posts);
    }

    return result;
  }

  async count(): Promise<number> {
    const result = await this.db(this.tableName)
      .count({ count: '*' })
      .first();

    return Number(result?.count ?? 0);
  }

  async countByAuthorId(authorId: number): Promise<number> {
    const result = await this.db(this.tableName)
      .count({ count: '*' })
      .where({ author_id: authorId })
      .first();

    return Number(result?.count ?? 0);
  }

  async create(input: CreatePostInput): Promise<Post> {
    const [id] = await this.db(this.tableName).insert({
      title: input.title,
      author_id: input.authorId,
      description: input.description,
      content: input.content,
    });

    const post = await this.findById(id);
    if (!post) {
      throw new Error('Failed to create post');
    }
    return post;
  }

  async update(id: number, input: UpdatePostInput): Promise<Post> {
    const updateData: Partial<PostRow> = {};
    
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.content !== undefined) updateData.content = input.content;

    if (Object.keys(updateData).length > 0) {
      await this.db(this.tableName).where({ id }).update(updateData);
    }

    const post = await this.findById(id);
    if (!post) {
      throw new Error('Post not found after update');
    }
    return post;
  }

  async delete(id: number): Promise<void> {
    await this.db(this.tableName).where({ id }).delete();
  }
}
