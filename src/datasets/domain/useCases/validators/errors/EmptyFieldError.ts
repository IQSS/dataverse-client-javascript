import { FieldValidationError } from './FieldValidationError';

export class EmptyFieldError extends FieldValidationError {
  constructor(
    metadataFieldName: string,
    citationBlockName: string,
    parentMetadataFieldName?: string,
    fieldPosition?: number,
  ) {
    super(
      metadataFieldName,
      citationBlockName,
      parentMetadataFieldName,
      fieldPosition,
      'The field should not be empty.',
    );
  }
}
