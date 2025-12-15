import type { IPostRepository } from '../../../domain/repositories/post.repository.interface.js';

/**
 * Count Posts Use Case
 * Returns the total count of posts
 */
export class CountPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(): Promise<number> {
    return this.postRepository.count();
  }
}
