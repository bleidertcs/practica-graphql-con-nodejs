import type { IAuthorRepository } from '../../../domain/repositories/author.repository.interface.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';

export class DeleteAuthorUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(id: number): Promise<boolean> {
    const existing = await this.authorRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Author', id);
    }

    await this.authorRepository.delete(id);
    return true;
  }
}
