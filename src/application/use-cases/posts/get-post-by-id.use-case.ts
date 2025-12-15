import type { IPostRepository } from '../../../domain/repositories/post.repository.interface.js';
import type { PostDto } from '../../dto/post.dto.js';
import { toPostDto } from '../../mappers/post.mapper.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';

/**
 * Get Post By ID Use Case
 * Retrieves a single post by its ID
 */
export class GetPostByIdUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<PostDto> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new EntityNotFoundError('Post', id);
    }

    return toPostDto(post);
  }
}
