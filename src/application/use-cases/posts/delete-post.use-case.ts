import type { IPostRepository } from '../../../domain/repositories/post.repository.interface.js';
import { EntityNotFoundError } from '../../../domain/errors/domain-errors.js';

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<boolean> {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Post', id);
    }

    await this.postRepository.delete(id);
    return true;
  }
}
