import type { Knex } from 'knex';
import type { User, UserRow } from '../../../domain/entities/user.entity.js';
import type { 
  IUserRepository, 
  CreateUserInput,
} from '../../../domain/repositories/user.repository.interface.js';

/**
 * Knex implementation of IUserRepository
 */
export class KnexUserRepository implements IUserRepository {
  private readonly tableName = 'users';

  constructor(private readonly db: Knex) {}

  /**
   * Map database row to domain entity
   */
  private toDomain(row: UserRow): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
    };
  }

  async findById(id: number): Promise<User | null> {
    const row = await this.db(this.tableName)
      .select('*')
      .where({ id })
      .first() as UserRow | undefined;

    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db(this.tableName)
      .select('*')
      .where({ email })
      .first() as UserRow | undefined;

    return row ? this.toDomain(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.db(this.tableName)
      .select('*')
      .where({ username })
      .first() as UserRow | undefined;

    return row ? this.toDomain(row) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const [id] = await this.db(this.tableName).insert({
      username: input.username,
      email: input.email,
      password_hash: input.passwordHash,
    });

    const user = await this.findById(id);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }
}
