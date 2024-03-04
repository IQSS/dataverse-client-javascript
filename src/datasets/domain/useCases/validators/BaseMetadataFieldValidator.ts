import { NewDatasetMetadataFieldValueDTO } from '../../dtos/NewDatasetDTO'
import { FieldValidationError } from './errors/FieldValidationError'
import { MetadataFieldInfo } from '../../../../metadataBlocks'

export interface NewDatasetMetadataFieldAndValueInfo {
  metadataFieldInfo: MetadataFieldInfo
  metadataFieldKey: string
  metadataFieldValue: NewDatasetMetadataFieldValueDTO
  metadataBlockName: string
  metadataParentFieldKey?: string
  metadataFieldPosition?: number
}

export abstract class BaseMetadataFieldValidator {
  abstract validate(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void

  protected createGeneralValidationError(
    newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo,
    reason: string
  ): FieldValidationError {
    return new FieldValidationError(
      newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
      newDatasetMetadataFieldAndValueInfo.metadataBlockName,
      newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
      newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
      reason
    )
  }
}
