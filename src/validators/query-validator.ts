import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../errors/http-error.js';

const QuerySchema = z.object({
    id: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(1000).optional(),
    offset: z.number().int().nonnegative().optional(),
});

export function validateQueryArgs(args: { id?: number; limit?: number; offset?: number }) {
    const result = QuerySchema.safeParse(args);
    if (!result.success) {
        // Map first error to BadRequest
        const first = result.error.issues[0];
        throw new BadRequestError(`${first.path.join('.') || 'param'}: ${first.message}`);
    }
    return true;
}

export function validateQueryMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        const id = req.params?.id ? Number(req.params.id) : undefined;
        const limit = req.query?.limit ? Number(req.query.limit as string) : undefined;
        const offset = req.query?.offset ? Number(req.query.offset as string) : undefined;
        validateQueryArgs({ id, limit, offset });
        next();
    } catch (err) {
        next(err);
    }
}
