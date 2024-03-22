import { ResourceValidationError } from '../../../../../core/domain/useCases/validators/errors/ResourceValidationError'

export class FieldValidationError extends ResourceValidationError {
  citationBlockName: string
  metadataFieldName: string
  parentMetadataFieldName?: string
  fieldPosition?: number

  constructor(
    metadataFieldName: string,
    citationBlockName: string,
    parentMetadataFieldName?: string,
    fieldPosition?: number,
    reason?: string
  ) {
    let message = `There was an error when validating the field ${metadataFieldName} from metadata block ${citationBlockName}`
    if (parentMetadataFieldName) {
      message += ` with parent field ${parentMetadataFieldName}`
    }
    if (fieldPosition != undefined) {
      message += ` in position ${fieldPosition}`
    }
    if (reason) {
      message += `. Reason was: ${reason}`
    }
    super(message)
    this.citationBlockName = citationBlockName
    this.metadataFieldName = metadataFieldName
    this.parentMetadataFieldName = parentMetadataFieldName
    this.fieldPosition = fieldPosition
  }
}
