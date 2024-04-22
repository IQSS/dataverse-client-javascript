import {
  Dataset,
  DatasetLicense,
  DatasetVersionState,
  DatasetMetadataBlocks,
  DatasetMetadataFields,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue,
  ANONYMIZED_FIELD_VALUE
} from '../../../domain/models/Dataset'
import { AxiosResponse } from 'axios'
import {
  DatasetPayload,
  LicensePayload,
  MetadataFieldPayload,
  MetadataBlocksPayload,
  MetadataFieldValuePayload,
  MetadataSubfieldValuePayload
} from './DatasetPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import TurndownService from 'turndown'

const turndownService = new TurndownService()

export const transformVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data
  return transformVersionPayloadToDataset(versionPayload)
}

export const transformVersionPayloadToDataset = (versionPayload: DatasetPayload): Dataset => {
  const datasetModel: Dataset = {
    id: versionPayload.datasetId,
    versionId: versionPayload.id,
    persistentId: versionPayload.datasetPersistentId,
    versionInfo: {
      majorNumber: versionPayload.versionNumber,
      minorNumber: versionPayload.versionMinorNumber,
      state: versionPayload.versionState as DatasetVersionState,
      createTime: new Date(versionPayload.createTime),
      lastUpdateTime: new Date(versionPayload.lastUpdateTime),
      releaseTime: new Date(versionPayload.releaseTime)
    },
    metadataBlocks: transformPayloadToDatasetMetadataBlocks(versionPayload.metadataBlocks),
    ...(versionPayload.isPartOf && {
      isPartOf: transformPayloadToOwnerNode(versionPayload.isPartOf)
    })
  }
  if ('license' in versionPayload) {
    datasetModel.license = transformPayloadToDatasetLicense(versionPayload.license)
  }
  if ('alternativePersistentId' in versionPayload) {
    datasetModel.alternativePersistentId = versionPayload.alternativePersistentId
  }
  if ('publicationDate' in versionPayload) {
    datasetModel.publicationDate = versionPayload.publicationDate
  }
  if ('citationDate' in versionPayload) {
    datasetModel.citationDate = versionPayload.citationDate
  }
  return datasetModel
}

const transformPayloadToDatasetLicense = (licensePayload: LicensePayload): DatasetLicense => {
  const datasetLicense: DatasetLicense = {
    name: licensePayload.name,
    uri: licensePayload.uri
  }

  if ('iconUri' in licensePayload) {
    datasetLicense.iconUri = licensePayload.iconUri
  }
  return datasetLicense
}

const transformPayloadToDatasetMetadataBlocks = (
  metadataBlocksPayload: MetadataBlocksPayload
): DatasetMetadataBlocks => {
  return Object.keys(metadataBlocksPayload).map((metadataBlockKey) => {
    const metadataBlock = metadataBlocksPayload[metadataBlockKey]
    return {
      name: metadataBlock.name,
      fields: transformPayloadToDatasetMetadataFields(metadataBlock.fields)
    }
  }) as DatasetMetadataBlocks
}

const transformPayloadToDatasetMetadataFields = (
  metadataFieldsPayload: MetadataFieldPayload[]
): DatasetMetadataFields => {
  return metadataFieldsPayload.reduce(
    (datasetMetadataFieldsMap: DatasetMetadataFields, field: MetadataFieldPayload) => {
      datasetMetadataFieldsMap[field.typeName] = transformPayloadToDatasetMetadataFieldValue(
        field.value,
        field.typeClass
      )
      return datasetMetadataFieldsMap
    },
    {}
  )
}

const transformPayloadToDatasetMetadataFieldValue = (
  metadataFieldValuePayload: MetadataFieldValuePayload,
  typeClass: string
): DatasetMetadataFieldValue => {
  function isArrayOfSubfieldValue(
    array: (string | MetadataSubfieldValuePayload)[]
  ): array is MetadataSubfieldValuePayload[] {
    return array.length > 0 && typeof array[0] !== 'string'
  }

  if (typeClass === 'anonymized') {
    return ANONYMIZED_FIELD_VALUE
  }

  if (typeof metadataFieldValuePayload === 'string') {
    return transformHtmlToMarkdown(metadataFieldValuePayload)
  } else if (Array.isArray(metadataFieldValuePayload)) {
    if (isArrayOfSubfieldValue(metadataFieldValuePayload)) {
      return metadataFieldValuePayload.map((metadataSubfieldValuePayload) =>
        transformPayloadToDatasetMetadataSubfieldValue(metadataSubfieldValuePayload)
      )
    } else {
      return metadataFieldValuePayload.map(transformHtmlToMarkdown)
    }
  } else {
    return transformPayloadToDatasetMetadataSubfieldValue(
      metadataFieldValuePayload as MetadataSubfieldValuePayload
    )
  }
}

const transformPayloadToDatasetMetadataSubfieldValue = (
  metadataSubfieldValuePayload: MetadataSubfieldValuePayload
): DatasetMetadataSubField => {
  const result: DatasetMetadataSubField = {}
  Object.keys(metadataSubfieldValuePayload).forEach((key) => {
    const subFieldValue = metadataSubfieldValuePayload[key].value
    result[key] = transformHtmlToMarkdown(subFieldValue)
  })
  return result
}

export const transformHtmlToMarkdown = (source: string): string => {
  return turndownService.turndown(source)
}
