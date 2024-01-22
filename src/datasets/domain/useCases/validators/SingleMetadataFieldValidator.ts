import {
  BaseMetadataFieldValidator,
  NewDatasetMetadataFieldAndValueInfo,
} from './BaseMetadataFieldValidator';

export class SingleMetadataFieldValidator extends BaseMetadataFieldValidator {
  validate(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = newDatasetMetadataFieldAndValueInfo.metadataFieldValue;
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    if (Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting a single field, not an array.',
      );
    }
    if (typeof metadataFieldValue === 'object' && metadataFieldInfo.type !== 'NONE') {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting a string, not child fields.',
      );
    }
    if (typeof metadataFieldValue === 'string' && metadataFieldInfo.type === 'NONE') {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting child fields, not a string.',
      );
    }
    this.validateFieldValue(newDatasetMetadataFieldAndValueInfo);
  }
}
