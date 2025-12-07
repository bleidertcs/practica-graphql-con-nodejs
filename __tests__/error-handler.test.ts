import errorHandler from '../src/middleware/error-handler.js';
import { BadRequestError } from '../src/errors/http-error.js';
import logger from '../src/utils/logger.js';

jest.mock('../src/utils/logger.js', () => ({
    error: jest.fn(),
}));

function makeRes() {
    const status = jest.fn(() => ({ json }));
    const json = jest.fn(() => ({}));
    return { status, json } as any;
}

describe('errorHandler', () => {
    afterEach(() => {
        (logger.error as jest.Mock).mockClear();
    });
    it('handles HttpError with status and message', () => {
        const req: any = { method: 'GET', originalUrl: '/test' };
        const res: any = makeRes();
        const next = jest.fn();
        const err = new BadRequestError('bad');
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('handles generic error as 500', () => {
        const req: any = { method: 'GET', originalUrl: '/test' };
        const res: any = makeRes();
        const next = jest.fn();
        const err = new Error('boom');
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalled();
    });
});
