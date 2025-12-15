import type { Request, Response, NextFunction } from 'express';
import { DomainError, EntityNotFoundError } from '../../../domain/errors/domain-errors.js';
import logger from '../../../shared/utils/logger.js';

/**
 * HTTP Error class for infrastructure layer
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const path = `${req.method} ${req.originalUrl}`;

  // Handle domain errors
  if (err instanceof EntityNotFoundError) {
    logger.warn(`Not Found - ${path} - ${err.message}`);
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof DomainError) {
    logger.warn(`Domain Error - ${path} - ${err.message}`);
    res.status(400).json({ error: err.message });
    return;
  }

  // Handle HTTP errors
  if (err instanceof HttpError) {
    logger.error(`HTTP ${err.status} - ${path} - ${err.message}`);
    const payload: Record<string, unknown> = { error: err.message };
    if (process.env.NODE_ENV !== 'production') {
      payload.stack = err.stack;
    }
    res.status(err.status).json(payload);
    return;
  }

  // Handle unknown errors
  logger.error(`Unhandled error - ${path}`, err);
  const payload: Record<string, unknown> = { error: 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production') {
    payload.details = String(err);
  }
  res.status(500).json(payload);
}
