import logger from './utils/logger.js';
import express from 'express';
import { Pool } from 'mysql2/promise';
import * as authorsController from './controllers/authors.controller.js';
import * as postsController from './controllers/posts.controller.js';
import { validateQueryParams } from './middleware/validate-query.js';

const log = logger;
const router = express.Router();

// Extend the Request interface to include the 'pool' property
declare global {
  namespace Express {
    interface Request {
      pool: Pool;
    }
  }
}

router.get(['/authors', '/authors/:id'], validateQueryParams, authorsController.list);

router.get(['/authors-list', '/authors-list/:id'], validateQueryParams, authorsController.listOnly);

router.get('/authors-count', authorsController.count);

router.get(['/posts', '/posts/:id'], validateQueryParams, postsController.list);

router.get(['/posts-list', '/posts-list/:id'], validateQueryParams, postsController.listOnly);

router.get('/posts-count', postsController.count);

router.get('/posts-by-author/:id', validateQueryParams, postsController.listByAuthor);

router.get('/posts-by-author-list/:id', validateQueryParams, postsController.listByAuthorOnly);

router.get('/posts-by-author-count/:id', validateQueryParams, postsController.countByAuthor);

export default router;