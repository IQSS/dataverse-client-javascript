import { ResourceValidationError } from './errors/ResourceValidationError';

export interface NewResourceValidator {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  validate(...args: any[]): Promise<void | ResourceValidationError>;
}
