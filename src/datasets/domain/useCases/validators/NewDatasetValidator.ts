import { NewDataset, NewDatasetMetadataFieldValue, NewDatasetMetadataChildFieldValue } from '../../models/NewDataset';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataFieldInfo } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';
import { EmptyFieldError } from '../../../../core/domain/useCases/validators/errors/EmptyFieldError';
import { FieldValidationError } from '../../../../core/domain/useCases/validators/errors/FieldValidationError';

export class NewDatasetValidator implements NewResourceValidator<NewDataset> {
  private metadataBlockRepository: IMetadataBlocksRepository;

  constructor(metadataBlockRepository: IMetadataBlocksRepository) {
    this.metadataBlockRepository = metadataBlockRepository;
  }

  async validate(resource: NewDataset): Promise<void | ResourceValidationError> {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      const newDatasetMetadataBlockName = metadataBlockValues.name;

      const metadataBlock = await this.metadataBlockRepository.getMetadataBlockByName(newDatasetMetadataBlockName);
      for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
        const metadataFieldInfo: MetadataFieldInfo = metadataBlock.metadataFields[metadataFieldKey];
        const newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue = metadataBlockValues.fields[metadataFieldKey];

        this.validateMetadataFieldValue(
          metadataFieldInfo,
          metadataFieldKey,
          newDatasetMetadataFieldValue,
          newDatasetMetadataBlockName,
        );

        if (metadataFieldInfo.childMetadataFields != undefined) {
          const childMetadataFieldKeys = Object.keys(metadataFieldInfo.childMetadataFields);
          if (metadataFieldInfo.multiple) {
            const newDatasetMetadataFieldChildFieldValues =
              newDatasetMetadataFieldValue as NewDatasetMetadataChildFieldValue[];
            for (const metadataChildFieldValue of newDatasetMetadataFieldChildFieldValues) {
              this.validateChildMetadataFieldValues(
                childMetadataFieldKeys,
                metadataFieldInfo,
                metadataChildFieldValue,
                newDatasetMetadataBlockName,
                metadataFieldKey,
              );
            }
          } else {
            const metadataChildFieldValue = newDatasetMetadataFieldValue as NewDatasetMetadataChildFieldValue;
            this.validateChildMetadataFieldValues(
              childMetadataFieldKeys,
              metadataFieldInfo,
              metadataChildFieldValue,
              newDatasetMetadataBlockName,
              metadataFieldKey,
            );
          }
        }
      }
    }
  }

  private validateChildMetadataFieldValues(
    childMetadataFieldKeys: string[],
    metadataFieldInfo: MetadataFieldInfo,
    metadataChildFieldValue: Record<string, string>,
    newDatasetMetadataBlockName: string,
    metadataParentFieldKey: string,
  ) {
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey];
      this.validateMetadataFieldValue(
        childMetadataFieldInfo,
        childMetadataFieldKey,
        metadataChildFieldValue[childMetadataFieldKey],
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
      );
    }
  }

  private validateMetadataFieldValue(
    metadataFieldInfo: MetadataFieldInfo,
    metadataFieldKey: string,
    newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue,
    newDatasetMetadataBlockName: string,
    metadataParentFieldKey?: string,
  ): void {
    if (
      newDatasetMetadataFieldValue == undefined ||
      newDatasetMetadataFieldValue == null ||
      (typeof newDatasetMetadataFieldValue == 'string' && newDatasetMetadataFieldValue.trim() === '')
    ) {
      if (metadataFieldInfo.isRequired) {
        throw new EmptyFieldError(metadataFieldKey, newDatasetMetadataBlockName, metadataParentFieldKey);
      } else {
        return;
      }
    }
    if (metadataFieldInfo.multiple) {
      this.validateMultipleMetadataField(
        newDatasetMetadataFieldValue,
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        metadataFieldInfo,
      );
    } else {
      this.validateSingleMetadataField(
        newDatasetMetadataFieldValue,
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        metadataFieldInfo,
      );
    }
  }

  private validateMultipleMetadataField(
    newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue,
    metadataFieldKey: string,
    newDatasetMetadataBlockName: string,
    metadataParentFieldKey: string,
    metadataFieldInfo: MetadataFieldInfo,
  ) {
    if (!Array.isArray(newDatasetMetadataFieldValue)) {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting an array of values.',
      );
    }
    if (this.isValidArrayType(newDatasetMetadataFieldValue, 'string') && metadataFieldInfo.type === 'NONE') {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting an array of child fields, not strings.',
      );
    } else if (this.isValidArrayType(newDatasetMetadataFieldValue, 'object') && metadataFieldInfo.type !== 'NONE') {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting an array of strings, not child fields.',
      );
    } else if (
      !this.isValidArrayType(newDatasetMetadataFieldValue, 'object') &&
      !this.isValidArrayType(newDatasetMetadataFieldValue, 'string')
    ) {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'The provided array of values is not valid.',
      );
    }
  }

  private validateSingleMetadataField(
    newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue,
    metadataFieldKey: string,
    newDatasetMetadataBlockName: string,
    metadataParentFieldKey: string,
    metadataFieldInfo: MetadataFieldInfo,
  ) {
    if (Array.isArray(newDatasetMetadataFieldValue)) {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting a single field, not an array.',
      );
    }
    if (typeof newDatasetMetadataFieldValue === 'object' && metadataFieldInfo.type !== 'NONE') {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting a string, not child fields.',
      );
    }
    if (typeof newDatasetMetadataFieldValue === 'string' && metadataFieldInfo.type === 'NONE') {
      throw this.createValidationError(
        metadataFieldKey,
        newDatasetMetadataBlockName,
        metadataParentFieldKey,
        'Expecting child fields, not a string.',
      );
    }
  }

  private isValidArrayType(
    newDatasetMetadataFieldValue: Array<string | NewDatasetMetadataFieldValue>,
    expectedType: 'string' | 'object',
  ): boolean {
    return newDatasetMetadataFieldValue.every(
      (item: string | NewDatasetMetadataFieldValue) => typeof item === expectedType,
    );
  }

  private createValidationError(
    metadataFieldKey: string,
    newDatasetMetadataBlockName: string,
    parentMetadataFieldName: string | undefined,
    reason: string,
  ): FieldValidationError {
    return new FieldValidationError(metadataFieldKey, newDatasetMetadataBlockName, parentMetadataFieldName, reason);
  }
}
