import { FieldValidationError } from './FieldValidationError';

export class EmptyFieldError extends FieldValidationError {
  constructor(field: string) {
    super(field, 'The field should not be empty.');
  }
}
