import { ResourceValidationError } from './ResourceValidationError';

export class FieldValidationError extends ResourceValidationError {
  private citationBlockName: string;
  private metadataFieldName: string;
  private parentMetadataFieldName?: string;

  constructor(metadataFieldName: string, citationBlockName: string, parentMetadataFieldName?: string, reason?: string) {
    let message = `There was an error when validating the field ${metadataFieldName} from metadata block ${citationBlockName}`;
    if (metadataFieldName) {
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

  getCitationBlockName(): string {
    return this.citationBlockName;
  }

  getMetadataFieldName(): string {
    return this.metadataFieldName;
  }

  getParentMetadataFieldName(): string | undefined {
    return this.parentMetadataFieldName;
  }
}
