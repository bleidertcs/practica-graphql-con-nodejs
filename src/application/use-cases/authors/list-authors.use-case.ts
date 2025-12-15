import type { IAuthorRepository, ListAuthorsOptions } from '../../../domain/repositories/author.repository.interface.js';
import type { AuthorDto, AuthorsResponse } from '../../dto/author.dto.js';
import { toAuthorDtoList } from '../../mappers/author.mapper.js';

/**
 * List Authors Use Case
 * Retrieves a paginated list of authors
 */
export class ListAuthorsUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(options: ListAuthorsOptions = {}): Promise<AuthorsResponse> {
    const normalizedOptions: ListAuthorsOptions = {
      id: options.id,
      limit: options.limit ?? 20,
      offset: options.offset ?? 0,
    };

    const [authors, count] = await Promise.all([
      this.authorRepository.findAll(normalizedOptions),
      this.authorRepository.count(),
    ]);

    return {
      list: toAuthorDtoList(authors),
      count,
    };
  }
}
