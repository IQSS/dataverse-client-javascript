import { BaseMetadataFieldValidator, NewDatasetMetadataFieldAndValueInfo } from './BaseMetadataFieldValidator';
import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError';
import { DateFormatFieldError } from './errors/DateFormatFieldError';
import { MetadataFieldValidator } from './MetadataFieldValidator';
import { NewDatasetMetadataChildFieldValueDTO } from '../../dtos/NewDatasetDTO';
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator';

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

  private validateFieldValue(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    if (metadataFieldInfo.isControlledVocabulary) {
      this.validateControlledVocabularyFieldValue(newDatasetMetadataFieldAndValueInfo);
    }

    if (metadataFieldInfo.type == 'DATE') {
      this.validateDateFieldValue(newDatasetMetadataFieldAndValueInfo);
    }

    if (metadataFieldInfo.childMetadataFields != undefined) {
      this.validateChildMetadataFieldValues(newDatasetMetadataFieldAndValueInfo);
    }
  }

  private validateControlledVocabularyFieldValue(
    newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo,
  ) {
    if (
      !newDatasetMetadataFieldAndValueInfo.metadataFieldInfo.controlledVocabularyValues.includes(
        newDatasetMetadataFieldAndValueInfo.metadataFieldValue as string,
      )
    ) {
      throw new ControlledVocabularyFieldError(
        newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
        newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      );
    }
  }

  private validateDateFieldValue(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(newDatasetMetadataFieldAndValueInfo.metadataFieldValue as string)) {
      throw new DateFormatFieldError(
        newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
        newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      );
    }
  }

  private validateChildMetadataFieldValues(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    const childMetadataFieldKeys = Object.keys(metadataFieldInfo.childMetadataFields);
    const metadataFieldValidator = new MetadataFieldValidator(this, new MultipleMetadataFieldValidator(this));
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey];
      metadataFieldValidator.validate({
        metadataFieldInfo: childMetadataFieldInfo,
        metadataFieldKey: childMetadataFieldKey,
        metadataFieldValue: (
          newDatasetMetadataFieldAndValueInfo.metadataFieldValue as NewDatasetMetadataChildFieldValueDTO
        )[childMetadataFieldKey],
        metadataBlockName: newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataParentFieldKey: newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldPosition: newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      });
    }
  }
}
