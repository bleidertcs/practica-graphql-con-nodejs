/**
 * Base Domain Error
 * All domain-specific errors should extend this class
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

/**
 * Entity Not Found Error
 */
export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: number | string) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

/**
 * Invalid Entity Error
 */
export class InvalidEntityError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEntityError';
    Object.setPrototypeOf(this, InvalidEntityError.prototype);
  }
}
