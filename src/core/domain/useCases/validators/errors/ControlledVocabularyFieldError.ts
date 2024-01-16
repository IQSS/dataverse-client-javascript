import { FieldValidationError } from './FieldValidationError';

export class ControlledVocabularyFieldError extends FieldValidationError {
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
      'The field does have a valid controlled vocabulary value.',
    );
  }
}
