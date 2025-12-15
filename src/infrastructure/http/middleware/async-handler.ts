import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async wrapper to eliminate try-catch repetition in controllers
 * Catches errors and passes them to the Express error handler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
