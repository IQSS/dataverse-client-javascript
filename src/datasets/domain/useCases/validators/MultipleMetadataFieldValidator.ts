import {
  BaseMetadataFieldValidator,
  DatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { DatasetMetadataFieldValueDTO } from '../../dtos/DatasetDTO'
import { SingleMetadataFieldValidator } from './SingleMetadataFieldValidator'
import { MetadataFieldType } from '../../../../metadataBlocks/domain/models/MetadataBlock'

export class MultipleMetadataFieldValidator extends BaseMetadataFieldValidator {
  constructor(private singleMetadataFieldValidator: SingleMetadataFieldValidator) {
    super()
  }

  validate(datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = datasetMetadataFieldAndValueInfo.metadataFieldValue
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo
    if (!Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting an array of values.'
      )
    }
    if (
      this.isValidArrayType(metadataFieldValue, 'string') &&
      metadataFieldInfo.type === MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting an array of child fields, not strings.'
      )
    } else if (
      this.isValidArrayType(metadataFieldValue, 'object') &&
      metadataFieldInfo.type !== MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting an array of strings, not child fields.'
      )
    } else if (
      !this.isValidArrayType(metadataFieldValue, 'object') &&
      !this.isValidArrayType(metadataFieldValue, 'string')
    ) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'The provided array of values is not valid.'
      )
    }

    const fieldValues = metadataFieldValue as DatasetMetadataFieldValueDTO[]
    fieldValues.forEach((value, metadataFieldPosition) => {
      this.singleMetadataFieldValidator.validate({
        metadataFieldInfo: metadataFieldInfo,
        metadataFieldKey: datasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldValue: value,
        metadataBlockName: datasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataFieldPosition: metadataFieldPosition
      })
    })
  }

  private isValidArrayType(
    metadataFieldValue: Array<string | DatasetMetadataFieldValueDTO>,
    expectedType: 'string' | 'object'
  ): boolean {
    return metadataFieldValue.every(
      (item: string | DatasetMetadataFieldValueDTO) => typeof item === expectedType
    )
  }
}
