import type { IAuthorRepository, UpdateAuthorInput as RepoUpdateInput } from '../../../domain/repositories/author.repository.interface.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';
import { toAuthorDto } from '../../mappers/author.mapper.js';
import type { AuthorDto } from '../../dto/author.dto.js';

export interface UpdateAuthorInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  birthdate?: string;
}

export class UpdateAuthorUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(id: number, input: UpdateAuthorInput): Promise<AuthorDto> {
    const existing = await this.authorRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Author', id);
    }

    const repoInput: RepoUpdateInput = {
      firstName: input.first_name,
      lastName: input.last_name,
      email: input.email,
      birthdate: input.birthdate ? new Date(input.birthdate) : undefined,
    };

    const author = await this.authorRepository.update(id, repoInput);
    return toAuthorDto(author);
  }
}
