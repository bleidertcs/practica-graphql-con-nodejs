import type { IPostRepository } from '../../../domain/repositories/post.repository.interface.js';
import type { PostDto } from '../../dto/post.dto.js';
import { toPostDtoList } from '../../mappers/post.mapper.js';

/**
 * List Posts By Author Use Case
 * Retrieves all posts for a specific author
 */
export class ListPostsByAuthorUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(authorId: number): Promise<{ list: PostDto[]; count: number }> {
    const [posts, count] = await Promise.all([
      this.postRepository.findByAuthorId(authorId),
      this.postRepository.countByAuthorId(authorId),
    ]);

    return {
      list: toPostDtoList(posts),
      count,
    };
  }
}
