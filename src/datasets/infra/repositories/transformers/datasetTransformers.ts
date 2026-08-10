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
  DatasetLicensePayload,
  MetadataFieldPayload,
  MetadataBlocksPayload,
  MetadataFieldValuePayload,
  MetadataSubfieldValuePayload
} from './DatasetPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import TurndownService from 'turndown'
import {
  DatasetDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataFieldsDTO,
  DatasetMetadataFieldValueDTO,
  DatasetMetadataChildFieldValueDTO
} from '../../../domain/dtos/DatasetDTO'
import { MetadataBlock, MetadataFieldInfo } from '../../../../metadataBlocks'

const turndownService = new TurndownService()

export interface NewDatasetRequestPayload {
  datasetType?: string
  datasetVersion: {
    license?: DatasetLicense
    metadataBlocks: Record<string, MetadataBlockRequestPayload>
  }
}

export interface MetadataBlockRequestPayload {
  fields: MetadataFieldRequestPayload[]
  displayName: string
}

export interface MetadataFieldRequestPayload {
  value: MetadataFieldValueRequestPayload
  typeClass: string
  multiple: boolean
  typeName: string
}

export type MetadataFieldValueRequestPayload =
  | string
  | string[]
  | Record<string, MetadataFieldRequestPayload>
  | Record<string, MetadataFieldRequestPayload>[]

export interface UpdateDatasetRequestPayload {
  fields: MetadataFieldRequestPayload[]
}

export const transformDatasetModelToUpdateDatasetRequestPayload = (
  dataset: DatasetDTO,
  metadataBlocks: MetadataBlock[]
): UpdateDatasetRequestPayload => {
  const metadataFieldsRequestPayload: MetadataFieldRequestPayload[] = []
  const datasetMetadataBlocksValues: DatasetMetadataBlockValuesDTO[] = dataset.metadataBlockValues
  datasetMetadataBlocksValues.forEach(function (
    newDatasetMetadataBlockValues: DatasetMetadataBlockValuesDTO
  ) {
    const metadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name == newDatasetMetadataBlockValues.name
    ) as MetadataBlock
    const metadataBlockFieldsPayload: MetadataFieldRequestPayload[] = []
    const metadataBlockFields = metadataBlock.metadataFields
    const datasetMetadataFields = newDatasetMetadataBlockValues.fields
    for (const metadataFieldKey of Object.keys(datasetMetadataFields)) {
      const datasetMetadataFieldValue: DatasetMetadataFieldValueDTO =
        datasetMetadataFields[metadataFieldKey]
      metadataBlockFieldsPayload.push({
        value: transformMetadataFieldValueToRequestPayload(
          datasetMetadataFieldValue,
          metadataBlockFields[metadataFieldKey]
        ),
        typeClass: metadataBlockFields[metadataFieldKey].typeClass,
        multiple: metadataBlockFields[metadataFieldKey].multiple,
        typeName: metadataFieldKey
      })
    }
    metadataFieldsRequestPayload.push(...metadataBlockFieldsPayload)
  })
  return {
    fields: metadataFieldsRequestPayload
  }
}

export const transformDatasetModelToNewDatasetRequestPayload = (
  dataset: DatasetDTO,
  metadataBlocks: MetadataBlock[],
  datasetType?: string
): NewDatasetRequestPayload => {
  return {
    datasetType,
    datasetVersion: {
      ...(dataset.license && { license: dataset.license }),
      metadataBlocks: transformMetadataBlockModelsToRequestPayload(
        dataset.metadataBlockValues,
        metadataBlocks
      )
    }
  }
}

export const transformMetadataBlockModelsToRequestPayload = (
  datasetMetadataBlocksValues: DatasetMetadataBlockValuesDTO[],
  metadataBlocks: MetadataBlock[]
): Record<string, MetadataBlockRequestPayload> => {
  const metadataBlocksRequestPayload: Record<string, MetadataBlockRequestPayload> = {}
  datasetMetadataBlocksValues.forEach(function (
    newDatasetMetadataBlockValues: DatasetMetadataBlockValuesDTO
  ) {
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name == newDatasetMetadataBlockValues.name
    ) as MetadataBlock
    metadataBlocksRequestPayload[newDatasetMetadataBlockValues.name] = {
      fields: transformMetadataFieldModelsToRequestPayload(
        newDatasetMetadataBlockValues.fields,
        metadataBlock.metadataFields
      ),
      displayName: metadataBlock.displayName
    }
  })
  return metadataBlocksRequestPayload
}

export const transformMetadataFieldModelsToRequestPayload = (
  datasetMetadataFields: DatasetMetadataFieldsDTO,
  metadataBlockFields: Record<string, MetadataFieldInfo>
): MetadataFieldRequestPayload[] => {
  const metadataFieldsRequestPayload: MetadataFieldRequestPayload[] = []
  for (const metadataFieldKey of Object.keys(datasetMetadataFields)) {
    const newDatasetMetadataChildFieldValue: DatasetMetadataFieldValueDTO =
      datasetMetadataFields[metadataFieldKey]
    metadataFieldsRequestPayload.push({
      value: transformMetadataFieldValueToRequestPayload(
        newDatasetMetadataChildFieldValue,
        metadataBlockFields[metadataFieldKey]
      ),
      typeClass: metadataBlockFields[metadataFieldKey].typeClass,
      multiple: metadataBlockFields[metadataFieldKey].multiple,
      typeName: metadataFieldKey
    })
  }
  return metadataFieldsRequestPayload
}

export const transformMetadataFieldValueToRequestPayload = (
  datasetMetadataFieldValue: DatasetMetadataFieldValueDTO,
  metadataBlockFieldInfo: MetadataFieldInfo
): MetadataFieldValueRequestPayload => {
  let value: MetadataFieldValueRequestPayload
  if (metadataBlockFieldInfo.multiple) {
    const newDatasetMetadataChildFieldValues = datasetMetadataFieldValue as
      | string[]
      | DatasetMetadataChildFieldValueDTO[]
    if (typeof newDatasetMetadataChildFieldValues[0] == 'string') {
      value = datasetMetadataFieldValue as string[]
    } else {
      value = []
      ;(newDatasetMetadataChildFieldValues as DatasetMetadataChildFieldValueDTO[]).forEach(
        function (childMetadataFieldValue: DatasetMetadataChildFieldValueDTO) {
          ;(value as Record<string, MetadataFieldRequestPayload>[]).push(
            transformMetadataChildFieldValueToRequestPayload(
              childMetadataFieldValue,
              metadataBlockFieldInfo
            )
          )
        }
      )
    }
  } else {
    if (typeof datasetMetadataFieldValue == 'string') {
      value = datasetMetadataFieldValue
    } else {
      value = transformMetadataChildFieldValueToRequestPayload(
        datasetMetadataFieldValue as DatasetMetadataChildFieldValueDTO,
        metadataBlockFieldInfo
      )
    }
  }
  return value
}

export const transformMetadataChildFieldValueToRequestPayload = (
  datasetMetadataChildFieldValue: DatasetMetadataChildFieldValueDTO,
  metadataBlockFieldInfo: MetadataFieldInfo
): Record<string, MetadataFieldRequestPayload> => {
  const metadataChildFieldRequestPayload: Record<string, MetadataFieldRequestPayload> = {}
  for (const metadataChildFieldKey of Object.keys(datasetMetadataChildFieldValue)) {
    const childMetadataFieldInfo: MetadataFieldInfo = (
      metadataBlockFieldInfo.childMetadataFields as Record<string, MetadataFieldInfo>
    )[metadataChildFieldKey]
    const value: string = datasetMetadataChildFieldValue[metadataChildFieldKey] as unknown as string
    metadataChildFieldRequestPayload[metadataChildFieldKey] = {
      value: value,
      typeClass: childMetadataFieldInfo.typeClass,
      multiple: childMetadataFieldInfo.multiple,
      typeName: metadataChildFieldKey
    }
  }

  return metadataChildFieldRequestPayload
}

export const transformVersionResponseToDataset = (
  response: AxiosResponse,
  keepRawFields: boolean
): Dataset => {
  const versionPayload = response.data.data
  return transformVersionPayloadToDataset(versionPayload, keepRawFields)
}

export const transformVersionPayloadToDataset = (
  versionPayload: DatasetPayload,
  keepRawFields: boolean
): Dataset => {
  const datasetModel: Dataset = {
    id: versionPayload.datasetId,
    versionId: versionPayload.id,
    persistentId: versionPayload.datasetPersistentId,
    internalVersionNumber: versionPayload.internalVersionNumber,
    versionInfo: {
      majorNumber: versionPayload.versionNumber,
      minorNumber: versionPayload.versionMinorNumber,
      state: versionPayload.versionState as DatasetVersionState,
      createTime: new Date(versionPayload.createTime),
      lastUpdateTime: versionPayload.lastUpdateTime,
      releaseTime: new Date(versionPayload.releaseTime),
      deaccessionNote: versionPayload.deaccessionNote
    },
    termsOfUse: {
      termsOfAccess: {
        fileAccessRequest: versionPayload.fileAccessRequest,
        termsOfAccessForRestrictedFiles: transformPayloadText(
          keepRawFields,
          versionPayload.termsOfAccess
        ),
        dataAccessPlace: transformPayloadText(keepRawFields, versionPayload.dataAccessPlace),
        originalArchive: transformPayloadText(keepRawFields, versionPayload.originalArchive),
        availabilityStatus: transformPayloadText(keepRawFields, versionPayload.availabilityStatus),
        contactForAccess: transformPayloadText(keepRawFields, versionPayload.contactForAccess),
        sizeOfCollection: transformPayloadText(keepRawFields, versionPayload.sizeOfCollection),
        studyCompletion: transformPayloadText(keepRawFields, versionPayload.studyCompletion)
      }
    },
    metadataBlocks: transformPayloadToDatasetMetadataBlocks(
      versionPayload.metadataBlocks,
      keepRawFields
    ),
    ...(versionPayload.isPartOf && {
      isPartOf: transformPayloadToOwnerNode(versionPayload.isPartOf)
    })
  }
  if ('license' in versionPayload) {
    datasetModel.license = transformPayloadToDatasetLicense(
      versionPayload.license as DatasetLicensePayload
    )
  } else {
    datasetModel.termsOfUse.customTerms = {
      termsOfUse: transformPayloadText(keepRawFields, versionPayload.termsOfUse) as string,
      confidentialityDeclaration: transformPayloadText(
        keepRawFields,
        versionPayload.confidentialityDeclaration
      ),
      specialPermissions: transformPayloadText(keepRawFields, versionPayload.specialPermissions),
      restrictions: transformPayloadText(keepRawFields, versionPayload.restrictions),
      citationRequirements: transformPayloadText(
        keepRawFields,
        versionPayload.citationRequirements
      ),
      depositorRequirements: transformPayloadText(
        keepRawFields,
        versionPayload.depositorRequirements
      ),
      conditions: transformPayloadText(keepRawFields, versionPayload.conditions),
      disclaimer: transformPayloadText(keepRawFields, versionPayload.disclaimer)
    }
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
  if ('guestbookId' in versionPayload) {
    datasetModel.guestbookId = versionPayload.guestbookId
  }
  if ('datasetType' in versionPayload) {
    datasetModel.datasetType = versionPayload.datasetType
  }
  return datasetModel
}

const transformPayloadToDatasetLicense = (
  licensePayload: DatasetLicensePayload
): DatasetLicense | undefined => {
  if (!licensePayload) {
    return undefined
  }

  const datasetLicense: DatasetLicense = {
    name: licensePayload.name,
    uri: licensePayload.uri
  }

  if ('iconUri' in licensePayload) {
    datasetLicense.iconUri = licensePayload.iconUri
  }

  return datasetLicense
}

const transformPayloadText = (
  keepRawFields: boolean,
  text: string | undefined
): string | undefined => {
  if (!text) {
    return undefined
  }
  return keepRawFields ? text : transformHtmlToMarkdown(text)
}

export const transformPayloadToDatasetMetadataBlocks = (
  metadataBlocksPayload: MetadataBlocksPayload,
  keepRawFields: boolean
): DatasetMetadataBlocks => {
  return Object.keys(metadataBlocksPayload).map((metadataBlockKey) => {
    const metadataBlock = metadataBlocksPayload[metadataBlockKey]
    return {
      name: metadataBlock.name,
      fields: transformPayloadToDatasetMetadataFields(metadataBlock.fields, keepRawFields)
    }
  }) as DatasetMetadataBlocks
}

const transformPayloadToDatasetMetadataFields = (
  metadataFieldsPayload: MetadataFieldPayload[],
  keepRawFields: boolean
): DatasetMetadataFields => {
  return metadataFieldsPayload.reduce(
    (datasetMetadataFieldsMap: DatasetMetadataFields, field: MetadataFieldPayload) => {
      datasetMetadataFieldsMap[field.typeName] = transformPayloadToDatasetMetadataFieldValue(
        field.value,
        field.typeClass,
        keepRawFields
      )
      return datasetMetadataFieldsMap
    },
    {}
  )
}

const transformPayloadToDatasetMetadataFieldValue = (
  metadataFieldValuePayload: MetadataFieldValuePayload,
  typeClass: string,
  keepRawFields: boolean
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
    if (keepRawFields) {
      return metadataFieldValuePayload
    }
    return transformHtmlToMarkdown(metadataFieldValuePayload)
  } else if (Array.isArray(metadataFieldValuePayload)) {
    if (isArrayOfSubfieldValue(metadataFieldValuePayload)) {
      return metadataFieldValuePayload.map((metadataSubfieldValuePayload) =>
        transformPayloadToDatasetMetadataSubfieldValue(metadataSubfieldValuePayload, keepRawFields)
      )
    } else {
      if (keepRawFields) {
        return metadataFieldValuePayload
      }
      return metadataFieldValuePayload.map(transformHtmlToMarkdown)
    }
  } else {
    return transformPayloadToDatasetMetadataSubfieldValue(
      metadataFieldValuePayload as MetadataSubfieldValuePayload,
      keepRawFields
    )
  }
}

const transformPayloadToDatasetMetadataSubfieldValue = (
  metadataSubfieldValuePayload: MetadataSubfieldValuePayload,
  keepRawFields: boolean
): DatasetMetadataSubField => {
  const result: DatasetMetadataSubField = {}
  Object.keys(metadataSubfieldValuePayload).forEach((key) => {
    const subField = metadataSubfieldValuePayload[key]
    result[key] = transformPayloadToDatasetMetadataFieldValue(
      subField.value,
      subField.typeClass,
      keepRawFields
    )
  })
  return result
}

export const transformHtmlToMarkdown = (source: string): string => {
  return turndownService.turndown(source)
}
