import { validateQueryArgs } from '../src/validators/query-validator.js';
import { BadRequestError } from '../src/errors/http-error.js';

describe('validateQueryArgs', () => {
    it('accepts valid args', () => {
        expect(validateQueryArgs({ id: 1, limit: 10, offset: 0 })).toBe(true);
        expect(validateQueryArgs({ limit: 20 })).toBe(true);
    });

    it('rejects invalid id', () => {
        expect(() => validateQueryArgs({ id: -1 })).toThrow(BadRequestError);
        expect(() => validateQueryArgs({ id: 0 })).toThrow(BadRequestError);
    });

    it('rejects invalid limit', () => {
        expect(() => validateQueryArgs({ limit: -5 })).toThrow(BadRequestError);
        expect(() => validateQueryArgs({ limit: 0 })).toThrow(BadRequestError);
        expect(() => validateQueryArgs({ limit: 5000 })).toThrow(BadRequestError);
    });

    it('rejects invalid offset', () => {
        expect(() => validateQueryArgs({ offset: -1 })).toThrow(BadRequestError);
    });
});
