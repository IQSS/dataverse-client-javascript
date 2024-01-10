import { ResourceValidationError } from './ResourceValidationError';

export class FieldValidationError extends ResourceValidationError {
  constructor(field: string, reason?: string) {
    let message = `There was an error when validating the field ${field}.`;
    if (reason) {
      message += ` Reason was: ${reason}`;
    }
    super(message);
  }
}
