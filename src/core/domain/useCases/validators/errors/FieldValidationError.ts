import { ResourceValidationError } from './ResourceValidationError';

export class FieldValidationError extends ResourceValidationError {
  citationBlockName: string;
  metadataFieldName: string;
  parentMetadataFieldName?: string;

  constructor(metadataFieldName: string, citationBlockName: string, parentMetadataFieldName?: string, reason?: string) {
    let message = `There was an error when validating the field ${metadataFieldName} from metadata block ${citationBlockName}`;
    if (parentMetadataFieldName) {
      message += ` with parent field ${parentMetadataFieldName}`;
    }
    if (reason) {
      message += `. Reason was: ${reason}`;
    }
    super(message);
    this.citationBlockName = citationBlockName;
    this.metadataFieldName = metadataFieldName;
    this.parentMetadataFieldName = parentMetadataFieldName;
  }
}
