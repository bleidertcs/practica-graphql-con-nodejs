import { Request, Response } from 'express';
import { QueryArgs } from '../dto/query-args.js';
import * as authorsService from '../services/authors.service.js';

export const list = async (req: Request, res: Response) => {
    try {
        const args: QueryArgs = {
            id: req.params.id ? parseInt(req.params.id) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        };
        const list = await authorsService.listAuthors(req.db, args);
        const count = await authorsService.countAuthors(req.db);
        res.status(200).send({ list, count });
    } catch (e) {
        console.error('authors.list | error =>', e);
        res.status(500).send(e);
    }
};

export const listOnly = async (req: Request, res: Response) => {
    try {
        const args: QueryArgs = {
            id: req.params.id ? parseInt(req.params.id) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        };
        const list = await authorsService.listAuthors(req.db, args);
        res.status(200).send({ list });
    } catch (e) {
        console.error('authors.listOnly | error =>', e);
        res.status(500).send(e);
    }
};

export const count = async (req: Request, res: Response) => {
    try {
        const count = await authorsService.countAuthors(req.db);
        res.status(200).send({ count });
    } catch (e) {
        console.error('authors.count | error =>', e);
        res.status(500).send(e);
    }
};
