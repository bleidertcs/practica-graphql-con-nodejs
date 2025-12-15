import type { Knex } from 'knex';
import type { Author, AuthorRow } from '../../../domain/entities/author.entity.js';
import type { 
  IAuthorRepository, 
  ListAuthorsOptions,
  CreateAuthorInput,
  UpdateAuthorInput,
} from '../../../domain/repositories/author.repository.interface.js';

/**
 * Knex implementation of IAuthorRepository
 */
export class KnexAuthorRepository implements IAuthorRepository {
  private readonly tableName = 'authors';

  constructor(private readonly db: Knex) {}

  /**
   * Map database row to domain entity
   */
  private toDomain(row: AuthorRow): Author {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      birthdate: row.birthdate,
      added: row.added,
    };
  }

  async findAll(options: ListAuthorsOptions): Promise<Author[]> {
    const query = this.db(this.tableName)
      .select('*')
      .orderBy('first_name', 'asc')
      .orderBy('last_name', 'asc');

    if (typeof options.id !== 'undefined') {
      query.where({ id: options.id });
    }

    if (typeof options.limit !== 'undefined') {
      query.limit(options.limit);
    }

    if (typeof options.offset !== 'undefined') {
      query.offset(options.offset);
    }

    const rows = await query as AuthorRow[];
    return rows.map(row => this.toDomain(row));
  }

  async findById(id: number): Promise<Author | null> {
    const row = await this.db(this.tableName)
      .select('*')
      .where({ id })
      .first() as AuthorRow | undefined;

    return row ? this.toDomain(row) : null;
  }

  async findByIds(ids: number[]): Promise<Author[]> {
    if (ids.length === 0) return [];

    const rows = await this.db(this.tableName)
      .select('*')
      .whereIn('id', ids) as AuthorRow[];

    return rows.map(row => this.toDomain(row));
  }

  async count(): Promise<number> {
    const result = await this.db(this.tableName)
      .count({ count: '*' })
      .first();

    return Number(result?.count ?? 0);
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const [id] = await this.db(this.tableName).insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      birthdate: input.birthdate,
    });

    const author = await this.findById(id);
    if (!author) {
      throw new Error('Failed to create author');
    }
    return author;
  }

  async update(id: number, input: UpdateAuthorInput): Promise<Author> {
    const updateData: Partial<AuthorRow> = {};
    
    if (input.firstName !== undefined) updateData.first_name = input.firstName;
    if (input.lastName !== undefined) updateData.last_name = input.lastName;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.birthdate !== undefined) updateData.birthdate = input.birthdate;

    if (Object.keys(updateData).length > 0) {
      await this.db(this.tableName).where({ id }).update(updateData);
    }

    const author = await this.findById(id);
    if (!author) {
      throw new Error('Author not found after update');
    }
    return author;
  }

  async delete(id: number): Promise<void> {
    await this.db(this.tableName).where({ id }).delete();
  }
}
