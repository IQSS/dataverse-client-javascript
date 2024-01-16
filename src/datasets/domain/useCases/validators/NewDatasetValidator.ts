import { NewDataset, NewDatasetMetadataFieldValue, NewDatasetMetadataChildFieldValue } from '../../models/NewDataset';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataFieldInfo } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';
import { EmptyFieldError } from '../../../../core/domain/useCases/validators/errors/EmptyFieldError';
import { FieldValidationError } from '../../../../core/domain/useCases/validators/errors/FieldValidationError';
import { ControlledVocabularyFieldError } from '../../../../core/domain/useCases/validators/errors/ControlledVocabularyFieldError';

export class NewDatasetValidator implements NewResourceValidator<NewDataset> {
  private metadataBlockRepository: IMetadataBlocksRepository;

  constructor(metadataBlockRepository: IMetadataBlocksRepository) {
    this.metadataBlockRepository = metadataBlockRepository;
  }

  async validate(resource: NewDataset): Promise<void | ResourceValidationError> {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      const metadataBlockName = metadataBlockValues.name;

      const metadataBlock = await this.metadataBlockRepository.getMetadataBlockByName(metadataBlockName);
      for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
        this.validateMetadataField(
          metadataBlock.metadataFields[metadataFieldKey],
          metadataFieldKey,
          metadataBlockValues.fields[metadataFieldKey],
          metadataBlockName,
        );
      }
    }
  }

  private validateMetadataField(
    metadataFieldInfo: MetadataFieldInfo,
    metadataFieldKey: string,
    metadataFieldValue: NewDatasetMetadataFieldValue,
    metadataBlockName: string,
    metadataParentFieldKey?: string,
    metadataFieldPosition?: number,
  ): void {
    if (
      metadataFieldValue == undefined ||
      metadataFieldValue == null ||
      this.isEmptyString(metadataFieldValue) ||
      this.isEmptyArray(metadataFieldValue)
    ) {
      if (metadataFieldInfo.isRequired) {
        throw new EmptyFieldError(metadataFieldKey, metadataBlockName, metadataParentFieldKey, metadataFieldPosition);
      } else {
        return;
      }
    }
    if (metadataFieldInfo.multiple) {
      this.validateMultipleMetadataField(
        metadataFieldValue,
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldInfo,
        metadataFieldPosition,
      );
    } else {
      this.validateSingleMetadataField(
        metadataFieldValue,
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldInfo,
        metadataFieldPosition,
      );
    }
  }

  private validateMultipleMetadataField(
    metadataFieldValue: NewDatasetMetadataFieldValue,
    metadataFieldKey: string,
    metadataBlockName: string,
    metadataParentFieldKey: string,
    metadataFieldInfo: MetadataFieldInfo,
    metadataFieldPosition: number,
  ) {
    if (!Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting an array of values.',
      );
    }
    if (this.isValidArrayType(metadataFieldValue, 'string') && metadataFieldInfo.type === 'NONE') {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting an array of child fields, not strings.',
      );
    } else if (this.isValidArrayType(metadataFieldValue, 'object') && metadataFieldInfo.type !== 'NONE') {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting an array of strings, not child fields.',
      );
    } else if (
      !this.isValidArrayType(metadataFieldValue, 'object') &&
      !this.isValidArrayType(metadataFieldValue, 'string')
    ) {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'The provided array of values is not valid.',
      );
    }

    const fieldValues = metadataFieldValue as NewDatasetMetadataFieldValue[];
    fieldValues.forEach((value, metadataFieldPosition) => {
      this.validateFieldValue(
        metadataFieldInfo,
        value,
        metadataBlockName,
        metadataFieldKey,
        metadataParentFieldKey,
        metadataFieldPosition,
      );
    });
  }

  private validateSingleMetadataField(
    metadataFieldValue: NewDatasetMetadataFieldValue,
    metadataFieldKey: string,
    metadataBlockName: string,
    metadataParentFieldKey: string,
    metadataFieldInfo: MetadataFieldInfo,
    metadataFieldPosition: number,
  ) {
    if (Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting a single field, not an array.',
      );
    }
    if (typeof metadataFieldValue === 'object' && metadataFieldInfo.type !== 'NONE') {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting a string, not child fields.',
      );
    }
    if (typeof metadataFieldValue === 'string' && metadataFieldInfo.type === 'NONE') {
      throw this.createGeneralValidationError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
        'Expecting child fields, not a string.',
      );
    }
    this.validateFieldValue(
      metadataFieldInfo,
      metadataFieldValue,
      metadataBlockName,
      metadataFieldKey,
      metadataParentFieldKey,
      metadataFieldPosition,
    );
  }

  private validateFieldValue(
    metadataFieldInfo: MetadataFieldInfo,
    value: NewDatasetMetadataFieldValue,
    metadataBlockName: string,
    metadataFieldKey: string,
    metadataParentFieldKey: string,
    metadataFieldPosition: number,
  ) {
    if (metadataFieldInfo.isControlledVocabulary) {
      this.validateControlledVocabularyFieldValue(
        metadataFieldInfo,
        value as string,
        metadataBlockName,
        metadataFieldKey,
        metadataParentFieldKey,
        metadataFieldPosition,
      );
    } else if (metadataFieldInfo.childMetadataFields != undefined) {
      this.validateChildMetadataFieldValues(
        metadataFieldInfo,
        value as NewDatasetMetadataChildFieldValue,
        metadataBlockName,
        metadataFieldKey,
        metadataFieldPosition,
      );
    }
  }

  private validateControlledVocabularyFieldValue(
    metadataFieldInfo: MetadataFieldInfo,
    controledVocabularyValue: string,
    metadataBlockName: string,
    metadataFieldKey: string,
    metadataParentFieldKey?: string,
    metadataFieldPosition?: number,
  ) {
    if (!metadataFieldInfo.controlledVocabularyValues.includes(controledVocabularyValue)) {
      throw new ControlledVocabularyFieldError(
        metadataFieldKey,
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
      );
    }
  }

  private validateChildMetadataFieldValues(
    metadataFieldInfo: MetadataFieldInfo,
    metadataChildFieldValue: NewDatasetMetadataChildFieldValue,
    metadataBlockName: string,
    metadataParentFieldKey: string,
    metadataFieldPosition?: number,
  ) {
    const childMetadataFieldKeys = Object.keys(metadataFieldInfo.childMetadataFields);
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey];
      this.validateMetadataField(
        childMetadataFieldInfo,
        childMetadataFieldKey,
        metadataChildFieldValue[childMetadataFieldKey],
        metadataBlockName,
        metadataParentFieldKey,
        metadataFieldPosition,
      );
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
    metadataFieldKey: string,
    metadataBlockName: string,
    parentMetadataFieldName: string | undefined,
    metadataFieldPosition: number | undefined,
    reason: string,
  ): FieldValidationError {
    return new FieldValidationError(
      metadataFieldKey,
      metadataBlockName,
      parentMetadataFieldName,
      metadataFieldPosition,
      reason,
    );
  }
}
