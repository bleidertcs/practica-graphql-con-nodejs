import type { Request, Response } from 'express';
import type { 
  ListPostsUseCase, 
  CountPostsUseCase, 
  ListPostsByAuthorUseCase 
} from '../../../../application/use-cases/posts/index.js';
import type { QueryArgs } from '../../../../application/dto/query-args.dto.js';

/**
 * Post Controller
 * Handles HTTP requests for post resources
 */
export class PostController {
  constructor(
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly countPostsUseCase: CountPostsUseCase,
    private readonly listPostsByAuthorUseCase: ListPostsByAuthorUseCase
  ) {}

  /**
   * GET /posts or /posts/:id
   * Returns list and count
   */
  list = async (req: Request, res: Response): Promise<void> => {
    const args: QueryArgs = {
      id: req.params.id ? parseInt(req.params.id) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await this.listPostsUseCase.execute(args);
    res.status(200).json(result);
  };

  /**
   * GET /posts-list or /posts-list/:id
   * Returns only the list
   */
  listOnly = async (req: Request, res: Response): Promise<void> => {
    const args: QueryArgs = {
      id: req.params.id ? parseInt(req.params.id) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await this.listPostsUseCase.execute(args);
    res.status(200).json({ list: result.list });
  };

  /**
   * GET /posts-count
   * Returns only the count
   */
  count = async (_req: Request, res: Response): Promise<void> => {
    const count = await this.countPostsUseCase.execute();
    res.status(200).json({ count });
  };

  /**
   * GET /posts-by-author/:id
   * Returns posts by author with count
   */
  listByAuthor = async (req: Request, res: Response): Promise<void> => {
    const authorId = parseInt(req.params.id);
    const result = await this.listPostsByAuthorUseCase.execute(authorId);
    res.status(200).json(result);
  };

  /**
   * GET /posts-by-author-list/:id
   * Returns only posts by author
   */
  listByAuthorOnly = async (req: Request, res: Response): Promise<void> => {
    const authorId = parseInt(req.params.id);
    const result = await this.listPostsByAuthorUseCase.execute(authorId);
    res.status(200).json({ list: result.list });
  };

  /**
   * GET /posts-by-author-count/:id
   * Returns only count by author
   */
  countByAuthor = async (req: Request, res: Response): Promise<void> => {
    const authorId = parseInt(req.params.id);
    const result = await this.listPostsByAuthorUseCase.execute(authorId);
    res.status(200).json({ count: result.count });
  };
}
