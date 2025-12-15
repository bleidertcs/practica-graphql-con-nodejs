import type { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './error-handler.js';

/**
 * Validate query parameters middleware
 */
export function validateQueryParams(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { limit, offset } = req.query;

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit as string, 10);
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      throw new BadRequestError('Invalid limit parameter');
    }
  }

  if (offset !== undefined) {
    const parsedOffset = parseInt(offset as string, 10);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      throw new BadRequestError('Invalid offset parameter');
    }
  }

  next();
}

/**
 * Validate GraphQL args
 */
export function validateGraphQLArgs(args: { id?: number; limit?: number; offset?: number }): void {
  if (args.limit !== undefined && args.limit < 0) {
    throw new BadRequestError('Invalid limit parameter');
  }
  if (args.offset !== undefined && args.offset < 0) {
    throw new BadRequestError('Invalid offset parameter');
  }
}
