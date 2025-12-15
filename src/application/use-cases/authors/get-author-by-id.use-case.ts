import type { IAuthorRepository } from '../../../domain/repositories/author.repository.interface.js';
import type { AuthorDto } from '../../dto/author.dto.js';
import { toAuthorDto } from '../../mappers/author.mapper.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';

/**
 * Get Author By ID Use Case
 * Retrieves a single author by their ID
 */
export class GetAuthorByIdUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(id: number): Promise<AuthorDto> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new EntityNotFoundError('Author', id);
    }

    return toAuthorDto(author);
  }
}
