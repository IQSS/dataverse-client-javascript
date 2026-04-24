import {
  BaseMetadataFieldValidator,
  DatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { ControlledVocabularyFieldError } from './errors/ControlledVocabularyFieldError'
import { MetadataFieldValidator } from './MetadataFieldValidator'
import { DatasetMetadataChildFieldValueDTO } from '../../dtos/DatasetDTO'
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator'
import {
  MetadataFieldInfo,
  MetadataFieldType
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

    if (metadataFieldInfo.childMetadataFields != undefined) {
      this.validateChildMetadataFieldValues(datasetMetadataFieldAndValueInfo)
    }
  }

  private validateControlledVocabularyFieldValue(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo
  ) {
    if (
      !datasetMetadataFieldAndValueInfo.metadataFieldInfo.controlledVocabularyValues?.includes(
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

  private validateChildMetadataFieldValues(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo
  ) {
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo

    const childMetadataFieldKeys = Object.keys(
      metadataFieldInfo.childMetadataFields as Record<string, MetadataFieldInfo>
    )

    const metadataFieldValidator = new MetadataFieldValidator(
      this,
      new MultipleMetadataFieldValidator(this)
    )

    for (const childMetadataFieldKey of childMetadataFieldKeys) {
      const childMetadataFieldInfo = (
        metadataFieldInfo.childMetadataFields as Record<string, MetadataFieldInfo>
      )[childMetadataFieldKey]

      const allowEmptyForConditionallyRequiredField: boolean =
        this.allowEmptyValueForConditionallyRequiredField(
          datasetMetadataFieldAndValueInfo,
          childMetadataFieldKey
        )

      metadataFieldValidator.validate({
        metadataFieldInfo: childMetadataFieldInfo,
        metadataFieldKey: childMetadataFieldKey,
        metadataFieldValue: (
          datasetMetadataFieldAndValueInfo.metadataFieldValue as DatasetMetadataChildFieldValueDTO
        )[childMetadataFieldKey],
        metadataBlockName: datasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataParentFieldKey: datasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldPosition: datasetMetadataFieldAndValueInfo.metadataFieldPosition,
        allowEmptyForConditionallyRequiredField
      })
    }
  }

  /**
   * This method allows setting empty values for conditionally required child fields.
   * A child field is conditionally required if it is required and its parent field is not required.
   * The child field should be required only if any of its sibling fields has a value, otherwise it should be optional.
   */

  private allowEmptyValueForConditionallyRequiredField(
    datasetMetadataFieldAndValueInfo: DatasetMetadataFieldAndValueInfo,
    childMetadataFieldKey: string
  ): boolean {
    let result = false
    const metadataFieldInfo = datasetMetadataFieldAndValueInfo.metadataFieldInfo

    const childMetadataFieldKeys = Object.keys(
      metadataFieldInfo.childMetadataFields as Record<string, MetadataFieldInfo>
    )

    const conditionallyRequiredChildFields: false | string[] =
      !datasetMetadataFieldAndValueInfo.metadataFieldInfo.isRequired &&
      childMetadataFieldKeys.filter(
        (childMetadataFieldKey) =>
          (metadataFieldInfo.childMetadataFields as Record<string, MetadataFieldInfo>)[
            childMetadataFieldKey
          ].isRequired
      )
    const hasConditionallyRequiredChildFields = Boolean(conditionallyRequiredChildFields)

    if (
      hasConditionallyRequiredChildFields &&
      Object.values(conditionallyRequiredChildFields as string[]).includes(childMetadataFieldKey)
    ) {
      // At this point we know we are standing on a child field that is required and the parent field is not required

      // Get the sibling fields and check if any of them has a value
      const { [childMetadataFieldKey as keyof Record<string, string>]: _, ...siblingFields } =
        datasetMetadataFieldAndValueInfo.metadataFieldValue as Record<string, string>

      const siblingsValues = Object.values(siblingFields) as string[]

      const isAnySiblingValuePresent = siblingsValues.some(
        ([, value]) => value !== undefined && value !== ''
      )

      result = !isAnySiblingValuePresent
    }

    return result
  }
}
