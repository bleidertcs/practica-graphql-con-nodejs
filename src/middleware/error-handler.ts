import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.js';
import logger from '../utils/logger.js';

export default function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
    const path = `${req.method} ${req.originalUrl}`;
    if (err instanceof HttpError) {
        logger.error(`HTTP ${err.status} - ${path} - ${err.message}`);
        const payload: any = { error: err.message };
        if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
        res.status(err.status).json(payload);
        return;
    }

    logger.error(`Unhandled error - ${path}`, err);
    const payload: any = { error: 'Internal Server Error' };
    if (process.env.NODE_ENV !== 'production') payload.details = String(err);
    res.status(500).json(payload);
}
