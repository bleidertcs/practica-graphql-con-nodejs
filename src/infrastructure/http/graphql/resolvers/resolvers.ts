import type { Knex } from 'knex';
import type { QueryArgs } from '../../../../application/dto/query-args.dto.js';
import type { ListAuthorsUseCase } from '../../../../application/use-cases/authors/list-authors.use-case.js';
import type { CreateAuthorUseCase, CreateAuthorInput } from '../../../../application/use-cases/authors/create-author.use-case.js';
import type { UpdateAuthorUseCase, UpdateAuthorInput } from '../../../../application/use-cases/authors/update-author.use-case.js';
import type { DeleteAuthorUseCase } from '../../../../application/use-cases/authors/delete-author.use-case.js';
import type { ListPostsUseCase } from '../../../../application/use-cases/posts/list-posts.use-case.js';
import type { CreatePostUseCase, CreatePostInput } from '../../../../application/use-cases/posts/create-post.use-case.js';
import type { UpdatePostUseCase, UpdatePostInput } from '../../../../application/use-cases/posts/update-post.use-case.js';
import type { DeletePostUseCase } from '../../../../application/use-cases/posts/delete-post.use-case.js';
import type { RegisterUseCase, RegisterInput } from '../../../../application/use-cases/auth/register.use-case.js';
import type { LoginUseCase, LoginInput } from '../../../../application/use-cases/auth/login.use-case.js';
import type { DataLoaders } from '../data-loaders/data-loaders.js';
import type { PostDto } from '../../../../application/dto/post.dto.js';
import type { AuthorDto } from '../../../../application/dto/author.dto.js';
import { validateGraphQLArgs } from '../../middleware/validate-query.js';
import { createAuthorSchema, updateAuthorSchema } from '../../../../application/validators/author.validator.js';
import { createPostSchema, updatePostSchema } from '../../../../application/validators/post.validator.js';

/**
 * GraphQL Context type
 */
export interface GraphQLContext {
  db: Knex;
  dataLoaders: DataLoaders;
  useCases: {
    // Authors
    listAuthors: ListAuthorsUseCase;
    createAuthor: CreateAuthorUseCase;
    updateAuthor: UpdateAuthorUseCase;
    deleteAuthor: DeleteAuthorUseCase;
    // Posts
    listPosts: ListPostsUseCase;
    createPost: CreatePostUseCase;
    updatePost: UpdatePostUseCase;
    deletePost: DeletePostUseCase;
    // Auth
    register: RegisterUseCase;
    login: LoginUseCase;
  };
}

/**
 * Create GraphQL resolvers with injected use cases
 */
export function createResolvers() {
  return {
    Query: {
      authors: async (
        _parent: unknown,
        args: QueryArgs,
        context: GraphQLContext
      ) => {
        validateGraphQLArgs(args);
        return context.useCases.listAuthors.execute(args);
      },

      posts: async (
        _parent: unknown,
        args: QueryArgs,
        context: GraphQLContext
      ) => {
        validateGraphQLArgs(args);
        return context.useCases.listPosts.execute(args);
      },
    },

    Mutation: {
      // Author mutations
      createAuthor: async (
        _parent: unknown,
        { input }: { input: CreateAuthorInput },
        context: GraphQLContext
      ) => {
        // Validate input with Zod
        const validated = createAuthorSchema.parse(input);
        return context.useCases.createAuthor.execute(validated);
      },

      updateAuthor: async (
        _parent: unknown,
        { id, input }: { id: number; input: UpdateAuthorInput },
        context: GraphQLContext
      ) => {
        // Validate input with Zod
        const validated = updateAuthorSchema.parse(input);
        return context.useCases.updateAuthor.execute(id, validated);
      },

      deleteAuthor: async (
        _parent: unknown,
        { id }: { id: number },
        context: GraphQLContext
      ) => {
        return context.useCases.deleteAuthor.execute(id);
      },

      // Post mutations
      createPost: async (
        _parent: unknown,
        { input }: { input: CreatePostInput },
        context: GraphQLContext
      ) => {
        // Validate input with Zod
        const validated = createPostSchema.parse(input);
        return context.useCases.createPost.execute(validated);
      },

      updatePost: async (
        _parent: unknown,
        { id, input }: { id: number; input: UpdatePostInput },
        context: GraphQLContext
      ) => {
        // Validate input with Zod
        const validated = updatePostSchema.parse(input);
        return context.useCases.updatePost.execute(id, validated);
      },

      deletePost: async (
        _parent: unknown,
        { id }: { id: number },
        context: GraphQLContext
      ) => {
        return context.useCases.deletePost.execute(id);
      },

      // Auth mutations
      register: async (
        _parent: unknown,
        { input }: { input: RegisterInput },
        context: GraphQLContext
      ) => {
        const result = await context.useCases.register.execute(input);
        return {
          user: result.user,
          accessToken: result.tokens.accessToken,
        };
      },

      login: async (
        _parent: unknown,
        { input }: { input: LoginInput },
        context: GraphQLContext
      ) => {
        const result = await context.useCases.login.execute(input);
        return {
          user: result.user,
          accessToken: result.tokens.accessToken,
        };
      },
    },

    Post: {
      author: async (
        post: PostDto,
        _args: unknown,
        context: GraphQLContext
      ) => {
        const result = await context.dataLoaders.authorById.load(post.author_id);
        if (result instanceof Error) {
          return null;
        }
        return result;
      },
    },

    Author: {
      posts: async (
        author: AuthorDto,
        _args: unknown,
        context: GraphQLContext
      ) => {
        return context.dataLoaders.postsByAuthorId.load(author.id);
      },
    },
  };
}
