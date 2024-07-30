import { AxiosResponse } from 'axios'
import {
  MetadataBlock,
  MetadataFieldInfo,
  MetadataFieldTypeClass,
  MetadataFieldType,
  MetadataFieldWatermark
} from '../../../domain/models/MetadataBlock'
import { MetadataBlockPayload } from './MetadataBlockPayload'
import { MetadataFieldInfoPayload } from './MetadataFieldInfoPayload'

export const transformMetadataBlocksResponseToMetadataBlocks = (
  response: AxiosResponse
): MetadataBlock[] => {
  const metadataBlocksPayload = response.data.data
  const metadataBlocks: MetadataBlock[] = []
  metadataBlocksPayload.forEach(function (metadataBlockPayload: MetadataBlockPayload) {
    metadataBlocks.push(transformMetadataBlockPayloadToMetadataBlock(metadataBlockPayload))
  })
  return metadataBlocks
}

export const transformMetadataBlockResponseToMetadataBlock = (
  response: AxiosResponse
): MetadataBlock => {
  const metadataBlockPayload = response.data.data
  return transformMetadataBlockPayloadToMetadataBlock(metadataBlockPayload)
}

export const transformMetadataFieldInfosResponseToMetadataFieldInfos = (
  response: AxiosResponse
): MetadataFieldInfo[] => {
  const metadataFieldInfosPayload = response.data.data
  const metadataFieldInfos: MetadataFieldInfo[] = []
  metadataFieldInfosPayload.forEach(function (metadataBlockPayload: MetadataFieldInfoPayload) {
    metadataFieldInfos.push(transformPayloadMetadataFieldInfo(metadataBlockPayload))
  })
  return metadataFieldInfos
}

const transformMetadataBlockPayloadToMetadataBlock = (
  metadataBlockPayload: MetadataBlockPayload
): MetadataBlock => {
  const metadataFields: Record<string, MetadataFieldInfo> = {}
  const metadataBlockFieldsPayload = metadataBlockPayload.fields
  const childFieldKeys = getChildFieldKeys(metadataBlockFieldsPayload)
  Object.keys(metadataBlockFieldsPayload).forEach((metadataFieldKey) => {
    const metadataFieldIsAlreadyPresentAsChildField = childFieldKeys.has(metadataFieldKey)
    if (!metadataFieldIsAlreadyPresentAsChildField) {
      const metadataFieldInfoPayload = metadataBlockFieldsPayload[
        metadataFieldKey
      ] as MetadataFieldInfoPayload
      metadataFields[metadataFieldKey] = transformPayloadMetadataFieldInfo(metadataFieldInfoPayload)
    }
  })
  return {
    id: metadataBlockPayload.id,
    name: metadataBlockPayload.name,
    displayName: metadataBlockPayload.displayName,
    displayOnCreate: metadataBlockPayload.displayOnCreate,
    metadataFields: metadataFields
  }
}

const getChildFieldKeys = (metadataBlockFieldsPayload: Record<string, unknown>): Set<string> => {
  const childFieldKeys = new Set<string>()
  Object.values(metadataBlockFieldsPayload).forEach(
    (fieldInfo: { childFields?: Record<string, unknown> }) => {
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
  metadataFieldInfoPayload: MetadataFieldInfoPayload,
  isChild = false
): MetadataFieldInfo => {
  const metadataFieldInfo: MetadataFieldInfo = {
    name: metadataFieldInfoPayload.name,
    displayName: metadataFieldInfoPayload.displayName,
    title: metadataFieldInfoPayload.title,
    type: metadataFieldInfoPayload.type as MetadataFieldType,
    watermark: metadataFieldInfoPayload.watermark as MetadataFieldWatermark,
    description: metadataFieldInfoPayload.description,
    multiple: metadataFieldInfoPayload.multiple,
    isControlledVocabulary: metadataFieldInfoPayload.isControlledVocabulary,
    ...(metadataFieldInfoPayload.controlledVocabularyValues && {
      controlledVocabularyValues: metadataFieldInfoPayload.controlledVocabularyValues
    }),
    displayFormat: metadataFieldInfoPayload.displayFormat,
    isRequired: metadataFieldInfoPayload.isRequired,
    displayOrder: metadataFieldInfoPayload.displayOrder,
    typeClass: metadataFieldInfoPayload.typeClass as MetadataFieldTypeClass,
    displayOnCreate: metadataFieldInfoPayload.displayOnCreate
  }
  if (!isChild && 'childFields' in metadataFieldInfoPayload) {
    const childMetadataFieldsPayload = metadataFieldInfoPayload.childFields as Record<
      string,
      MetadataFieldInfoPayload
    >
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
