import type { IAuthorRepository, CreateAuthorInput as RepoCreateInput } from '../../../domain/repositories/author.repository.interface.js';
import { toAuthorDto } from '../../mappers/author.mapper.js';
import type { AuthorDto } from '../../dto/author.dto.js';

export interface CreateAuthorInput {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
}

export class CreateAuthorUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(input: CreateAuthorInput): Promise<AuthorDto> {
    const repoInput: RepoCreateInput = {
      firstName: input.first_name,
      lastName: input.last_name,
      email: input.email,
      birthdate: new Date(input.birthdate),
    };
    const author = await this.authorRepository.create(repoInput);
    return toAuthorDto(author);
  }
}
