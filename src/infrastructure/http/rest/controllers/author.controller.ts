import type { Request, Response } from 'express';
import type { ListAuthorsUseCase, CountAuthorsUseCase } from '../../../../application/use-cases/authors/index.js';
import type { QueryArgs } from '../../../../application/dto/query-args.dto.js';

/**
 * Author Controller
 * Handles HTTP requests for author resources
 */
export class AuthorController {
  constructor(
    private readonly listAuthorsUseCase: ListAuthorsUseCase,
    private readonly countAuthorsUseCase: CountAuthorsUseCase
  ) {}

  /**
   * GET /authors or /authors/:id
   * Returns list and count
   */
  list = async (req: Request, res: Response): Promise<void> => {
    const args: QueryArgs = {
      id: req.params.id ? parseInt(req.params.id) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await this.listAuthorsUseCase.execute(args);
    res.status(200).json(result);
  };

  /**
   * GET /authors-list or /authors-list/:id
   * Returns only the list
   */
  listOnly = async (req: Request, res: Response): Promise<void> => {
    const args: QueryArgs = {
      id: req.params.id ? parseInt(req.params.id) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await this.listAuthorsUseCase.execute(args);
    res.status(200).json({ list: result.list });
  };

  /**
   * GET /authors-count
   * Returns only the count
   */
  count = async (_req: Request, res: Response): Promise<void> => {
    const count = await this.countAuthorsUseCase.execute();
    res.status(200).json({ count });
  };
}
