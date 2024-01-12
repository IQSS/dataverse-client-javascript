import { NewDataset, NewDatasetMetadataFieldValue } from '../../models/NewDataset';
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

        if (metadataFieldInfo.isRequired && newDatasetMetadataFieldValue == undefined) {
          throw new EmptyFieldError(metadataFieldKey, newDatasetMetadataBlockName);
        }

        this.validateMetadataFieldValueType(
          metadataFieldInfo,
          metadataFieldKey,
          newDatasetMetadataFieldValue,
          newDatasetMetadataBlockName,
        );

        if (metadataFieldInfo.childMetadataFields != undefined) {
          // TODO: child fields validation
        }
      }
    }
  }

  validateMetadataFieldValueType(
    metadataFieldInfo: MetadataFieldInfo,
    metadataFieldKey: string,
    newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue,
    newDatasetMetadataBlockName: string,
  ): void {
    if (metadataFieldInfo.multiple) {
      if (!Array.isArray(newDatasetMetadataFieldValue)) {
        throw this.createValidationError(
          metadataFieldKey,
          newDatasetMetadataBlockName,
          undefined,
          'Expecting an array of values.',
        );
      }
      if (this.isValidArrayType(newDatasetMetadataFieldValue, 'string') && metadataFieldInfo.type === 'NONE') {
        throw this.createValidationError(
          metadataFieldKey,
          newDatasetMetadataBlockName,
          undefined,
          'Expecting an array of sub fields, not strings.',
        );
      } else if (this.isValidArrayType(newDatasetMetadataFieldValue, 'object') && metadataFieldInfo.type !== 'NONE') {
        throw this.createValidationError(
          metadataFieldKey,
          newDatasetMetadataBlockName,
          undefined,
          'Expecting an array of strings, not sub fields.',
        );
      } else if (
        !this.isValidArrayType(newDatasetMetadataFieldValue, 'object') &&
        !this.isValidArrayType(newDatasetMetadataFieldValue, 'string')
      ) {
        throw this.createValidationError(
          metadataFieldKey,
          newDatasetMetadataBlockName,
          undefined,
          'The provided array of values is not valid.',
        );
      }
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
