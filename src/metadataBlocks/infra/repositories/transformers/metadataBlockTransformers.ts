import { AxiosResponse } from 'axios'
import { MetadataBlock, MetadataFieldInfo } from '../../../domain/models/MetadataBlock'

export const transformMetadataBlockResponseToMetadataBlock = (
  response: AxiosResponse
): MetadataBlock => {
  const metadataBlockPayload = response.data.data
  const metadataFields: Record<string, MetadataFieldInfo> = {}
  const metadataBlockFieldsPayload = metadataBlockPayload.fields
  Object.keys(metadataBlockFieldsPayload).forEach((metadataFieldKey) => {
    const metadataFieldInfoPayload = metadataBlockFieldsPayload[metadataFieldKey]
    if (!metadataFieldIsAlreadyPresentAsChildField(metadataFields, metadataFieldKey)) {
      metadataFields[metadataFieldKey] = transformPayloadMetadataFieldInfo(metadataFieldInfoPayload)
    }
  })
  return {
    id: metadataBlockPayload.id,
    name: metadataBlockPayload.name,
    displayName: metadataBlockPayload.displayName,
    metadataFields: metadataFields
  }
}

const transformPayloadMetadataFieldInfo = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadataFieldInfoPayload: any,
  isChild = false
): MetadataFieldInfo => {
  const metadataFieldInfo: MetadataFieldInfo = {
    name: metadataFieldInfoPayload.name,
    displayName: metadataFieldInfoPayload.displayName,
    title: metadataFieldInfoPayload.title,
    type: metadataFieldInfoPayload.type,
    watermark: metadataFieldInfoPayload.watermark,
    description: metadataFieldInfoPayload.description,
    multiple: metadataFieldInfoPayload.multiple,
    isControlledVocabulary: metadataFieldInfoPayload.isControlledVocabulary,
    ...(metadataFieldInfoPayload.controlledVocabularyValues && {
      controlledVocabularyValues: metadataFieldInfoPayload.controlledVocabularyValues
    }),
    displayFormat: metadataFieldInfoPayload.displayFormat,
    isRequired: metadataFieldInfoPayload.isRequired,
    displayOrder: metadataFieldInfoPayload.displayOrder,
    typeClass: metadataFieldInfoPayload.typeClass
  }
  if (!isChild && 'childFields' in metadataFieldInfoPayload) {
    const childMetadataFieldsPayload = metadataFieldInfoPayload.childFields
    const childMetadataFields: Record<string, MetadataFieldInfo> = {}
    Object.keys(childMetadataFieldsPayload).map((metadataFieldKey) => {
      childMetadataFields[metadataFieldKey] = transformPayloadMetadataFieldInfo(
        childMetadataFieldsPayload[metadataFieldKey],
        true
      )
    })
    metadataFieldInfo.childMetadataFields = childMetadataFields
  }
  return metadataFieldInfo
}

/**
 * This method checks if a new metadata field key is already present in the metadata fields.
 * We need this method since child fields are returned as sub-objects and as root objects in the response payload, so we don't want to replicate this behavior in the model.
 *
 * @param {Record<string, MetadataFieldInfo>} [metadataFields] - The current transformed metadata fields
 * @param {string} newMetadataFieldKey - The new metadata field key to transform
 *
 * @returns {boolean}
 */
const metadataFieldIsAlreadyPresentAsChildField = (
  metadataFields: Record<string, MetadataFieldInfo>,
  newMetadataFieldKey: string
): boolean => {
  let isPresent = false
  Object.keys(metadataFields).forEach((metadataFieldKey) => {
    if (
      metadataFields[metadataFieldKey].childMetadataFields &&
      metadataFields[metadataFieldKey].childMetadataFields[newMetadataFieldKey]
    ) {
      isPresent = true
    }
  })
  return isPresent
}
