import { FieldValidationError } from './FieldValidationError';

export class EmptyFieldError extends FieldValidationError {
  constructor(metadataFieldName: string, citationBlockName: string, parentMetadataFieldName?: string) {
    super(metadataFieldName, citationBlockName, parentMetadataFieldName, 'The field should not be empty.');
  }
}
