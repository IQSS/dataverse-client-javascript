import { DatasetMetadataFieldValueDTO } from '../../dtos/DatasetDTO'
import { FieldValidationError } from './errors/FieldValidationError'
import { MetadataFieldInfo } from '../../../../metadataBlocks'

export interface DatasetMetadataFieldAndValueInfo {
  metadataFieldInfo: MetadataFieldInfo
  metadataFieldKey: string
  metadataFieldValue: DatasetMetadataFieldValueDTO
  metadataBlockName: string
  metadataParentFieldKey?: string
  metadataFieldPosition?: number
}

export abstract class BaseMetadataFieldValidator {
  abstract validate(datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo): void

  protected createGeneralValidationError(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo,
    reason: string
  ): FieldValidationError {
    return new FieldValidationError(
      datasetMetadataFieldAndValueInfo.metadataFieldKey,
      datasetMetadataFieldAndValueInfo.metadataBlockName,
      datasetMetadataFieldAndValueInfo.metadataParentFieldKey,
      datasetMetadataFieldAndValueInfo.metadataFieldPosition,
      reason
    )
  }
}
