import { ResourceValidationError } from './errors/ResourceValidationError';

export interface NewResourceValidator<T> {
  validate(resource: T): Promise<void | ResourceValidationError>;
}
