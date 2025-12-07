import { Request, Response } from 'express';
import { QueryArgs } from '../dto/query-args.js';
import * as postsService from '../services/posts.service.js';

export const list = async (req: Request, res: Response) => {
    try {
        const args: QueryArgs = {
            id: req.params.id ? parseInt(req.params.id) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        };
        const list = await postsService.listPosts(req.db, args);
        const count = await postsService.countPosts(req.db);
        res.status(200).send({ list, count });
    } catch (e) {
        console.error('posts.list | error =>', e);
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
        const list = await postsService.listPosts(req.db, args);
        res.status(200).send({ list });
    } catch (e) {
        console.error('posts.listOnly | error =>', e);
        res.status(500).send(e);
    }
};

export const count = async (req: Request, res: Response) => {
    try {
        const count = await postsService.countPosts(req.db);
        res.status(200).send({ count });
    } catch (e) {
        console.error('posts.count | error =>', e);
        res.status(500).send(e);
    }
};

export const listByAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = parseInt(req.params.id);
        const list = await postsService.listPostsByAuthor(req.db, authorId);
        const count = await postsService.countPostsByAuthor(req.db, authorId);
        res.status(200).send({ list, count });
    } catch (e) {
        console.error('posts.listByAuthor | error =>', e);
        res.status(500).send(e);
    }
};

export const listByAuthorOnly = async (req: Request, res: Response) => {
    try {
        const authorId = parseInt(req.params.id);
        const list = await postsService.listPostsByAuthor(req.db, authorId);
        res.status(200).send({ list });
    } catch (e) {
        console.error('posts.listByAuthorOnly | error =>', e);
        res.status(500).send(e);
    }
};

export const countByAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = parseInt(req.params.id);
        const count = await postsService.countPostsByAuthor(req.db, authorId);
        res.status(200).send({ count });
    } catch (e) {
        console.error('posts.countByAuthor | error =>', e);
        res.status(500).send(e);
    }
};
