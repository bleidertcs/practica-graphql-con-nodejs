import express from 'express';
import type { AuthorController } from './controllers/author.controller.js';
import type { PostController } from './controllers/post.controller.js';
import { asyncHandler, validateQueryParams } from '../middleware/index.js';

/**
 * Create REST router with injected controllers
 */
export function createRestRouter(
  authorController: AuthorController,
  postController: PostController
) {
  const router = express.Router();

  // Author routes
  router.get(
    ['/authors', '/authors/:id'],
    validateQueryParams,
    asyncHandler(authorController.list)
  );

  router.get(
    ['/authors-list', '/authors-list/:id'],
    validateQueryParams,
    asyncHandler(authorController.listOnly)
  );

  router.get(
    '/authors-count',
    asyncHandler(authorController.count)
  );

  // Post routes
  router.get(
    ['/posts', '/posts/:id'],
    validateQueryParams,
    asyncHandler(postController.list)
  );

  router.get(
    ['/posts-list', '/posts-list/:id'],
    validateQueryParams,
    asyncHandler(postController.listOnly)
  );

  router.get(
    '/posts-count',
    asyncHandler(postController.count)
  );

  router.get(
    '/posts-by-author/:id',
    validateQueryParams,
    asyncHandler(postController.listByAuthor)
  );

  router.get(
    '/posts-by-author-list/:id',
    validateQueryParams,
    asyncHandler(postController.listByAuthorOnly)
  );

  router.get(
    '/posts-by-author-count/:id',
    validateQueryParams,
    asyncHandler(postController.countByAuthor)
  );

  return router;
}
