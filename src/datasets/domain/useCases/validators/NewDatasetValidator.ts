import {
  NewDataset,
  NewDatasetMetadataFieldValue,
  NewDatasetMetadataChildFieldValue,
  NewDatasetMetadataBlockValues,
} from '../../models/NewDataset';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { MetadataFieldInfo, MetadataBlock } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';
import { EmptyFieldError } from './errors/EmptyFieldError';
import { FieldValidationError } from './errors/FieldValidationError';
import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError';
import { DateFormatFieldError } from './errors/DateFormatFieldError';

export interface NewDatasetMetadataFieldAndValueInfo {
  metadataFieldInfo: MetadataFieldInfo;
  metadataFieldKey: string;
  metadataFieldValue: NewDatasetMetadataFieldValue;
  metadataBlockName: string;
  metadataParentFieldKey?: string;
  metadataFieldPosition?: number;
}

export class NewDatasetValidator implements NewResourceValidator {
  async validate(resource: NewDataset, metadataBlocks: MetadataBlock[]): Promise<void | ResourceValidationError> {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      await this.validateMetadataBlock(metadataBlockValues, metadataBlocks);
    }
  }

  private async validateMetadataBlock(
    metadataBlockValues: NewDatasetMetadataBlockValues,
    metadataBlocks: MetadataBlock[],
  ) {
    const metadataBlockName = metadataBlockValues.name;
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name === metadataBlockName,
    );
    for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
      this.validateMetadataField({
        metadataFieldInfo: metadataBlock.metadataFields[metadataFieldKey],
        metadataFieldKey: metadataFieldKey,
        metadataFieldValue: metadataBlockValues.fields[metadataFieldKey],
        metadataBlockName: metadataBlockName,
      });
    }
  }

  private validateMetadataField(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = newDatasetMetadataFieldAndValueInfo.metadataFieldValue;
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    if (
      metadataFieldValue == undefined ||
      metadataFieldValue == null ||
      this.isEmptyString(metadataFieldValue) ||
      this.isEmptyArray(metadataFieldValue)
    ) {
      if (metadataFieldInfo.isRequired) {
        throw new EmptyFieldError(
          newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
          newDatasetMetadataFieldAndValueInfo.metadataBlockName,
          newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
          newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
        );
      } else {
        return;
      }
    }
    if (metadataFieldInfo.multiple) {
      this.validateMultipleMetadataField(newDatasetMetadataFieldAndValueInfo);
    } else {
      this.validateSingleMetadataField(newDatasetMetadataFieldAndValueInfo);
    }
  }

  private validateMultipleMetadataField(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
    const metadataFieldValue = newDatasetMetadataFieldAndValueInfo.metadataFieldValue;
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    if (!Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(newDatasetMetadataFieldAndValueInfo, 'Expecting an array of values.');
    }
    if (this.isValidArrayType(metadataFieldValue, 'string') && metadataFieldInfo.type === 'NONE') {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting an array of child fields, not strings.',
      );
    } else if (this.isValidArrayType(metadataFieldValue, 'object') && metadataFieldInfo.type !== 'NONE') {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting an array of strings, not child fields.',
      );
    } else if (
      !this.isValidArrayType(metadataFieldValue, 'object') &&
      !this.isValidArrayType(metadataFieldValue, 'string')
    ) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'The provided array of values is not valid.',
      );
    }

    const fieldValues = metadataFieldValue as NewDatasetMetadataFieldValue[];
    fieldValues.forEach((value, metadataFieldPosition) => {
      this.validateFieldValue({
        metadataFieldInfo: metadataFieldInfo,
        metadataFieldKey: newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldValue: value,
        metadataBlockName: newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataParentFieldKey: newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldPosition: metadataFieldPosition,
      });
    });
  }

  private validateSingleMetadataField(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo) {
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
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey];
      this.validateMetadataField({
        metadataFieldInfo: childMetadataFieldInfo,
        metadataFieldKey: childMetadataFieldKey,
        metadataFieldValue: (
          newDatasetMetadataFieldAndValueInfo.metadataFieldValue as NewDatasetMetadataChildFieldValue
        )[childMetadataFieldKey],
        metadataBlockName: newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataParentFieldKey: newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldPosition: newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      });
    }
  }

  private isEmptyString(metadataFieldValue: NewDatasetMetadataFieldValue): boolean {
    return typeof metadataFieldValue == 'string' && metadataFieldValue.trim() === '';
  }

  private isEmptyArray(metadataFieldValue: NewDatasetMetadataFieldValue): boolean {
    return Array.isArray(metadataFieldValue) && (metadataFieldValue as Array<NewDatasetMetadataFieldValue>).length == 0;
  }

  private isValidArrayType(
    metadataFieldValue: Array<string | NewDatasetMetadataFieldValue>,
    expectedType: 'string' | 'object',
  ): boolean {
    return metadataFieldValue.every((item: string | NewDatasetMetadataFieldValue) => typeof item === expectedType);
  }

  private createGeneralValidationError(
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
}
