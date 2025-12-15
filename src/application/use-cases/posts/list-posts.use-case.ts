import type { IPostRepository, ListPostsOptions } from '../../../domain/repositories/post.repository.interface.js';
import type { PostDto, PostsResponse } from '../../dto/post.dto.js';
import { toPostDtoList } from '../../mappers/post.mapper.js';

/**
 * List Posts Use Case
 * Retrieves a paginated list of posts
 */
export class ListPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(options: ListPostsOptions = {}): Promise<PostsResponse> {
    const normalizedOptions: ListPostsOptions = {
      id: options.id,
      limit: options.limit ?? 20,
      offset: options.offset ?? 0,
    };

    const [posts, count] = await Promise.all([
      this.postRepository.findAll(normalizedOptions),
      this.postRepository.count(),
    ]);

    return {
      list: toPostDtoList(posts),
      count,
    };
  }
}
