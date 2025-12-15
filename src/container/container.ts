import type { Knex } from 'knex';
import { createKnexClient } from '../infrastructure/database/knex-client.js';
import { KnexAuthorRepository } from '../infrastructure/database/repositories/knex-author.repository.js';
import { KnexPostRepository } from '../infrastructure/database/repositories/knex-post.repository.js';
import { KnexUserRepository } from '../infrastructure/database/repositories/knex-user.repository.js';
import { 
  ListAuthorsUseCase,
  GetAuthorByIdUseCase,
  CountAuthorsUseCase,
  CreateAuthorUseCase,
  UpdateAuthorUseCase,
  DeleteAuthorUseCase,
} from '../application/use-cases/authors/index.js';
import {
  ListPostsUseCase,
  GetPostByIdUseCase,
  ListPostsByAuthorUseCase,
  CountPostsUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
} from '../application/use-cases/posts/index.js';
import {
  RegisterUseCase,
  LoginUseCase,
} from '../application/use-cases/auth/index.js';
import { AuthorController } from '../infrastructure/http/rest/controllers/author.controller.js';
import { PostController } from '../infrastructure/http/rest/controllers/post.controller.js';

/**
 * Application Container
 * Simple dependency injection container
 */
export class Container {
  private static instance: Container;
  
  // Database
  public readonly db: Knex;

  // Repositories
  public readonly authorRepository: KnexAuthorRepository;
  public readonly postRepository: KnexPostRepository;
  public readonly userRepository: KnexUserRepository;

  // Use Cases - Authors (Queries)
  public readonly listAuthorsUseCase: ListAuthorsUseCase;
  public readonly getAuthorByIdUseCase: GetAuthorByIdUseCase;
  public readonly countAuthorsUseCase: CountAuthorsUseCase;

  // Use Cases - Authors (Mutations)
  public readonly createAuthorUseCase: CreateAuthorUseCase;
  public readonly updateAuthorUseCase: UpdateAuthorUseCase;
  public readonly deleteAuthorUseCase: DeleteAuthorUseCase;

  // Use Cases - Posts (Queries)
  public readonly listPostsUseCase: ListPostsUseCase;
  public readonly getPostByIdUseCase: GetPostByIdUseCase;
  public readonly listPostsByAuthorUseCase: ListPostsByAuthorUseCase;
  public readonly countPostsUseCase: CountPostsUseCase;

  // Use Cases - Posts (Mutations)
  public readonly createPostUseCase: CreatePostUseCase;
  public readonly updatePostUseCase: UpdatePostUseCase;
  public readonly deletePostUseCase: DeletePostUseCase;

  // Use Cases - Auth
  public readonly registerUseCase: RegisterUseCase;
  public readonly loginUseCase: LoginUseCase;

  // Controllers
  public readonly authorController: AuthorController;
  public readonly postController: PostController;

  private constructor() {
    // Initialize database
    this.db = createKnexClient();

    // Initialize repositories
    this.authorRepository = new KnexAuthorRepository(this.db);
    this.postRepository = new KnexPostRepository(this.db);
    this.userRepository = new KnexUserRepository(this.db);

    // Initialize use cases - Authors (Queries)
    this.listAuthorsUseCase = new ListAuthorsUseCase(this.authorRepository);
    this.getAuthorByIdUseCase = new GetAuthorByIdUseCase(this.authorRepository);
    this.countAuthorsUseCase = new CountAuthorsUseCase(this.authorRepository);

    // Initialize use cases - Authors (Mutations)
    this.createAuthorUseCase = new CreateAuthorUseCase(this.authorRepository);
    this.updateAuthorUseCase = new UpdateAuthorUseCase(this.authorRepository);
    this.deleteAuthorUseCase = new DeleteAuthorUseCase(this.authorRepository);

    // Initialize use cases - Posts (Queries)
    this.listPostsUseCase = new ListPostsUseCase(this.postRepository);
    this.getPostByIdUseCase = new GetPostByIdUseCase(this.postRepository);
    this.listPostsByAuthorUseCase = new ListPostsByAuthorUseCase(this.postRepository);
    this.countPostsUseCase = new CountPostsUseCase(this.postRepository);

    // Initialize use cases - Posts (Mutations)
    this.createPostUseCase = new CreatePostUseCase(this.postRepository);
    this.updatePostUseCase = new UpdatePostUseCase(this.postRepository);
    this.deletePostUseCase = new DeletePostUseCase(this.postRepository);

    // Initialize use cases - Auth
    this.registerUseCase = new RegisterUseCase(this.userRepository);
    this.loginUseCase = new LoginUseCase(this.userRepository);

    // Initialize controllers
    this.authorController = new AuthorController(
      this.listAuthorsUseCase,
      this.countAuthorsUseCase
    );
    this.postController = new PostController(
      this.listPostsUseCase,
      this.countPostsUseCase,
      this.listPostsByAuthorUseCase
    );
  }

  /**
   * Get singleton instance of Container
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Destroy container instance (useful for testing)
   */
  public static async destroy(): Promise<void> {
    if (Container.instance) {
      await Container.instance.db.destroy();
      Container.instance = undefined as unknown as Container;
    }
  }
}

/**
 * Get container instance
 */
export const getContainer = (): Container => Container.getInstance();
