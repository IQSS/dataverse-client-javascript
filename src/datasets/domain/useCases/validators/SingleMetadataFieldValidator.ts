import {
  BaseMetadataFieldValidator,
  DatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError'
import { DateFormatFieldError } from './errors/DateFormatFieldError'
import { MetadataFieldValidator } from './MetadataFieldValidator'
import { DatasetMetadataChildFieldValueDTO } from '../../dtos/DatasetDTO'
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator'
import {
  MetadataFieldType,
  MetadataFieldWatermark
} from '../../../../metadataBlocks/domain/models/MetadataBlock'

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
    const {
      metadataFieldInfo: { watermark },
      metadataFieldValue
    } = datasetMetadataFieldAndValueInfo

    const acceptsAllDateFormats = watermark === MetadataFieldWatermark.YYYYOrYYYYMMOrYYYYMMDD

    const YYYY_MM_DD_DATE_FORMAT_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

    const YYYY_MM_FORMAT_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

    const YYYY_FORMAT_REGEX = /^\d{4}$/

    const isValidDateFormat = (value: string): boolean => {
      if (acceptsAllDateFormats) {
        // Check if it matches any of the formats
        return (
          YYYY_MM_DD_DATE_FORMAT_REGEX.test(value) ||
          YYYY_MM_FORMAT_REGEX.test(value) ||
          YYYY_FORMAT_REGEX.test(value)
        )
      } else {
        // Only accepts YYYY-MM-DD format
        return YYYY_MM_DD_DATE_FORMAT_REGEX.test(value)
      }
    }

    if (!isValidDateFormat(metadataFieldValue as string)) {
      throw new DateFormatFieldError(
        datasetMetadataFieldAndValueInfo.metadataFieldKey,
        datasetMetadataFieldAndValueInfo.metadataBlockName,
        watermark,
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
