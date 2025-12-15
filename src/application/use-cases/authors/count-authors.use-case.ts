import type { IAuthorRepository } from '../../../domain/repositories/author.repository.interface.js';

/**
 * Count Authors Use Case
 * Returns the total count of authors
 */
export class CountAuthorsUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(): Promise<number> {
    return this.authorRepository.count();
  }
}
