import { FieldValidationError } from './FieldValidationError'

export class DateFormatFieldError extends FieldValidationError {
  constructor(
    metadataFieldName: string,
    citationBlockName: string,
    validDateFormat: string,
    parentMetadataFieldName?: string,
    fieldPosition?: number
  ) {
    super(
      metadataFieldName,
      citationBlockName,
      parentMetadataFieldName,
      fieldPosition,
      `The field requires a valid date format (${validDateFormat}).`
    )
  }
}
