import {
  BaseMetadataFieldValidator,
  DatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError'
import { DateFormatFieldError } from './errors/DateFormatFieldError'
import { MetadataFieldValidator } from './MetadataFieldValidator'
import { DatasetMetadataChildFieldValueDTO } from '../../dtos/DatasetDTO'
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator'
import { MetadataFieldType } from '../../../../metadataBlocks/domain/models/MetadataBlock'

export class SingleMetadataFieldValidator extends BaseMetadataFieldValidator {
  validate(datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = datasetMetadataFieldAndValueInfo.metadataFieldValue
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo
    if (Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting a single field, not an array.'
      )
    }
    if (
      typeof metadataFieldValue === 'object' &&
      metadataFieldInfo.type !== MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting a string, not child fields.'
      )
    }
    if (
      typeof metadataFieldValue === 'string' &&
      metadataFieldInfo.type === MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        datasetMetadataFieldAndValueInfo,
        'Expecting child fields, not a string.'
      )
    }
    this.validateFieldValue(datasetMetadataFieldAndValueInfo)
  }

  private validateFieldValue(datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo) {
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo
    if (metadataFieldInfo.isControlledVocabulary) {
      this.validateControlledVocabularyFieldValue(datasetMetadataFieldAndValueInfo)
    }

    if (metadataFieldInfo.type == MetadataFieldType.Date) {
      this.validateDateFieldValue(datasetMetadataFieldAndValueInfo)
    }

    if (metadataFieldInfo.childMetadataFields != undefined) {
      this.validateChildMetadataFieldValues(datasetMetadataFieldAndValueInfo)
    }
  }

  private validateControlledVocabularyFieldValue(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo
  ) {
    if (
      !datasetMetadataFieldAndValueInfo.metadataFieldInfo.controlledVocabularyValues.includes(
        datasetMetadataFieldAndValueInfo.metadataFieldValue as string
      )
    ) {
      throw new ControlledVocabularyFieldError(
        datasetMetadataFieldAndValueInfo.metadataFieldKey,
        datasetMetadataFieldAndValueInfo.metadataBlockName,
        datasetMetadataFieldAndValueInfo.metadataParentFieldKey,
        datasetMetadataFieldAndValueInfo.metadataFieldPosition
      )
    }
  }

  private validateDateFieldValue(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo
  ) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateFormatRegex.test(datasetMetadataFieldAndValueInfo.metadataFieldValue as string)) {
      throw new DateFormatFieldError(
        datasetMetadataFieldAndValueInfo.metadataFieldKey,
        datasetMetadataFieldAndValueInfo.metadataBlockName,
        datasetMetadataFieldAndValueInfo.metadataParentFieldKey,
        datasetMetadataFieldAndValueInfo.metadataFieldPosition
      )
    }
  }

  private validateChildMetadataFieldValues(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo
  ) {
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo
    const childMetadataFieldKeys = Object.keys(metadataFieldInfo.childMetadataFields)
    const metadataFieldValidator = new MetadataFieldValidator(
      this,
      new MultipleMetadataFieldValidator(this)
    )
    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = metadataFieldInfo.childMetadataFields[childMetadataFieldKey]
      metadataFieldValidator.validate({
        metadataFieldInfo: childMetadataFieldInfo,
        metadataFieldKey: childMetadataFieldKey,
        metadataFieldValue: (
          datasetMetadataFieldAndValueInfo.metadataFieldValue as DatasetMetadataChildFieldValueDTO
        )[childMetadataFieldKey],
        metadataBlockName: datasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataParentFieldKey: datasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldPosition: datasetMetadataFieldAndValueInfo.metadataFieldPosition
      })
    }
  }
}
