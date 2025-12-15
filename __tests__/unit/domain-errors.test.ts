import { 
  DomainError, 
  EntityNotFoundError, 
  InvalidEntityError 
} from '../../src/domain/errors/domain-errors.js';

describe('Domain Errors', () => {
  describe('DomainError', () => {
    it('should create error with message', () => {
      const error = new DomainError('Something went wrong');
      
      expect(error.message).toBe('Something went wrong');
      expect(error.name).toBe('DomainError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
    });
  });

  describe('EntityNotFoundError', () => {
    it('should create error with entity name and id', () => {
      const error = new EntityNotFoundError('Author', 123);
      
      expect(error.message).toBe('Author with id 123 not found');
      expect(error.name).toBe('EntityNotFoundError');
      expect(error).toBeInstanceOf(DomainError);
    });

    it('should work with string id', () => {
      const error = new EntityNotFoundError('Post', 'abc-123');
      
      expect(error.message).toBe('Post with id abc-123 not found');
    });
  });

  describe('InvalidEntityError', () => {
    it('should create error with custom message', () => {
      const error = new InvalidEntityError('Email format is invalid');
      
      expect(error.message).toBe('Email format is invalid');
      expect(error.name).toBe('InvalidEntityError');
      expect(error).toBeInstanceOf(DomainError);
    });
  });
});
