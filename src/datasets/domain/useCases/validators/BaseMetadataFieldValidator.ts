import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError';
import { DateFormatFieldError } from './errors/DateFormatFieldError';
import { NewDatasetMetadataChildFieldValueDTO, NewDatasetMetadataFieldValueDTO } from '../../dtos/NewDatasetDTO';
import { FieldValidationError } from './errors/FieldValidationError';
import { MetadataFieldValidator } from './MetadataFieldValidator';
import { MetadataFieldInfo } from '../../../../metadataBlocks';

export interface NewDatasetMetadataFieldAndValueInfo {
  metadataFieldInfo: MetadataFieldInfo;
  metadataFieldKey: string;
  metadataFieldValue: NewDatasetMetadataFieldValueDTO;
  metadataBlockName: string;
  metadataParentFieldKey?: string;
  metadataFieldPosition?: number;
}

export abstract class BaseMetadataFieldValidator {
  abstract validate(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void;

  protected executeMetadataFieldValidator(
    metadataFieldValidator: BaseMetadataFieldValidator,
    newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo,
  ) {
    metadataFieldValidator.validate(newDatasetMetadataFieldAndValueInfo);
  }

  protected validateChildMetadataFieldValues(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    const childMetadataFieldKeys = Object.keys(metadataFieldInfo.childMetadataFields);
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey];
      this.executeMetadataFieldValidator(new MetadataFieldValidator(), {
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

  protected createGeneralValidationError(
    newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo,
    reason: string,
  ): FieldValidationError {
    return new FieldValidationError(
      newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
      newDatasetMetadataFieldAndValueInfo.metadataBlockName,
      newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
      newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      reason,
    );
  }

  protected validateFieldValue(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
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
}
