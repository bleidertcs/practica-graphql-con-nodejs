import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../../../application/services/auth.service.js';
import { HttpError } from './error-handler.js';

/**
 * Extend Express Request to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new HttpError(401, 'Authorization header required');
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new HttpError(401, 'Invalid authorization format. Use: Bearer <token>');
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [type, token] = authHeader.split(' ');

  if (type === 'Bearer' && token) {
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch {
      // Token invalid, but continue without user
    }
  }

  next();
}
