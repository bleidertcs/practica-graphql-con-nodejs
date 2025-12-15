import type { IPostRepository, CreatePostInput as RepoCreateInput } from '../../../domain/repositories/post.repository.interface.js';
import { toPostDto } from '../../mappers/post.mapper.js';
import type { PostDto } from '../../dto/post.dto.js';

export interface CreatePostInput {
  title: string;
  author_id: number;
  description?: string | null;
  content?: string | null;
}

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(input: CreatePostInput): Promise<PostDto> {
    const repoInput: RepoCreateInput = {
      title: input.title,
      authorId: input.author_id,
      description: input.description ?? null,
      content: input.content ?? null,
    };
    const post = await this.postRepository.create(repoInput);
    return toPostDto(post);
  }
}
