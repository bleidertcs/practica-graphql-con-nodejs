import type { IPostRepository, UpdatePostInput as RepoUpdateInput } from '../../../domain/repositories/post.repository.interface.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';
import { toPostDto } from '../../mappers/post.mapper.js';
import type { PostDto } from '../../dto/post.dto.js';

export interface UpdatePostInput {
  title?: string;
  description?: string | null;
  content?: string | null;
}

export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number, input: UpdatePostInput): Promise<PostDto> {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Post', id);
    }

    const repoInput: RepoUpdateInput = {
      title: input.title,
      description: input.description,
      content: input.content,
    };

    const post = await this.postRepository.update(id, repoInput);
    return toPostDto(post);
  }
}
