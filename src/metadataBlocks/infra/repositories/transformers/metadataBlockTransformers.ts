import { AxiosResponse } from 'axios'
import { MetadataBlock, MetadataFieldInfo } from '../../../domain/models/MetadataBlock'

export const transformMetadataBlockResponseToMetadataBlock = (
  response: AxiosResponse
): MetadataBlock => {
  const metadataBlockPayload = response.data.data
  const metadataFields: Record<string, MetadataFieldInfo> = {}
  const metadataBlockFieldsPayload = metadataBlockPayload.fields
  const childFieldKeys = getChildFieldKeys(metadataBlockFieldsPayload)
  Object.keys(metadataBlockFieldsPayload).forEach((metadataFieldKey) => {
    const metadataFieldIsAlreadyPresentAsChildField = childFieldKeys.has(metadataFieldKey)
    if (!metadataFieldIsAlreadyPresentAsChildField) {
      const metadataFieldInfoPayload = metadataBlockFieldsPayload[metadataFieldKey]
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

const getChildFieldKeys = (
  metadataBlockFieldsPayload: Record<string, { childFields?: any }>
): Set<string> => {
  const childFieldKeys = new Set<string>()
  Object.values(metadataBlockFieldsPayload).forEach(
    (fieldInfo: { childFields?: Record<string, any> }) => {
      if (fieldInfo.childFields) {
        Object.keys(fieldInfo.childFields).forEach((childKey) => {
          childFieldKeys.add(childKey)
        })
      }
    }
  )
  return childFieldKeys
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
