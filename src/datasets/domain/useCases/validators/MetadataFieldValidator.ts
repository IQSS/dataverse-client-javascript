import {
  BaseMetadataFieldValidator,
  DatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator'
import { SingleMetadataFieldValidator } from './SingleMetadataFieldValidator'
import { EmptyFieldError } from './errors/EmptyFieldError'
import { DatasetMetadataFieldValueDTO } from '../../dtos/DatasetDTO'

export class MetadataFieldValidator extends BaseMetadataFieldValidator {
  constructor(
    private singleMetadataFieldValidator: SingleMetadataFieldValidator,
    private multipleMetadataFieldValidator: MultipleMetadataFieldValidator
  ) {
    super()
  }

  validate(datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = datasetMetadataFieldAndValueInfo.metadataFieldValue
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo
    if (
      metadataFieldValue == undefined ||
      this.isEmptyString(metadataFieldValue) ||
      this.isEmptyArray(metadataFieldValue)
    ) {
      if (metadataFieldInfo.isRequired) {
        throw new EmptyFieldError(
          datasetMetadataFieldAndValueInfo.metadataFieldKey,
          datasetMetadataFieldAndValueInfo.metadataBlockName,
          datasetMetadataFieldAndValueInfo.metadataParentFieldKey,
          datasetMetadataFieldAndValueInfo.metadataFieldPosition
        )
      } else {
        return
      }
    }
    if (datasetMetadataFieldAndValueInfo.metadataFieldInfo.multiple) {
      this.multipleMetadataFieldValidator.validate(datasetMetadataFieldAndValueInfo)
    } else {
      this.singleMetadataFieldValidator.validate(datasetMetadataFieldAndValueInfo)
    }
  }

  private isEmptyString(metadataFieldValue: DatasetMetadataFieldValueDTO): boolean {
    return typeof metadataFieldValue == 'string' && metadataFieldValue.trim() === ''
  }

  private isEmptyArray(metadataFieldValue: DatasetMetadataFieldValueDTO): boolean {
    return (
      Array.isArray(metadataFieldValue) &&
      (metadataFieldValue as Array<DatasetMetadataFieldValueDTO>).length == 0
    )
  }
}
