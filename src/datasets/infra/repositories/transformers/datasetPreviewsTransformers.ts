import { AxiosResponse } from 'axios'
import { DatasetPreview } from '../../../domain/models/DatasetPreview'
import { DatasetVersionState } from '../../../domain/models/Dataset'
import { DatasetPreviewSubset } from '../../../domain/models/DatasetPreviewSubset'
import { DatasetPreviewCollectionPayload, DatasetPreviewPayload } from './DatasetPreviewPayload'
import { CollectionSummary } from '../../../../collections/domain/models/CollectionSummary'
import { PublicationStatus } from '../../../../core/domain/models/PublicationStatus'
import { CollectionItemType } from '../../../../collections/domain/models/CollectionItemType'
import { MyDataDatasetPreviewPayload } from './MyDataDatasetPreviewPayload'
import { DatasetMetadataBlock } from '../../../domain/models/Dataset'
import { transformPayloadToDatasetMetadataBlocks } from './datasetTransformers'

export const transformDatasetPreviewsResponseToDatasetPreviewSubset = (
  response: AxiosResponse
): DatasetPreviewSubset => {
  const responseDataPayload = response.data.data
  const datasetPreviewsPayload = responseDataPayload.items
  const datasetPreviews: DatasetPreview[] = []
  datasetPreviewsPayload.forEach(function (datasetPreviewPayload: DatasetPreviewPayload) {
    datasetPreviews.push(transformDatasetPreviewPayloadToDatasetPreview(datasetPreviewPayload))
  })
  return {
    datasetPreviews: datasetPreviews,
    totalDatasetCount: responseDataPayload.total_count
  }
}

export const transformDatasetPreviewPayloadToDatasetPreview = (
  datasetPreviewPayload: DatasetPreviewPayload,
  keepRawFields = false
): DatasetPreview => {
  const publicationStatuses: PublicationStatus[] = []
  datasetPreviewPayload.publicationStatuses.forEach((element) => {
    publicationStatuses.push(element as unknown as PublicationStatus)
  })
  const collections: CollectionSummary[] | undefined = datasetPreviewPayload.collections?.map(
    (collection: DatasetPreviewCollectionPayload) => ({
      id: collection.id,
      alias: collection.alias,
      displayName: collection.name
    })
  )
  const metadataBlocks: DatasetMetadataBlock[] | undefined = datasetPreviewPayload.metadataBlocks
    ? transformPayloadToDatasetMetadataBlocks(datasetPreviewPayload.metadataBlocks, keepRawFields)
    : undefined

  return {
    type: CollectionItemType.DATASET,
    persistentId: datasetPreviewPayload.global_id,
    title: datasetPreviewPayload.name,
    versionId: datasetPreviewPayload.versionId,
    versionInfo: {
      majorNumber: datasetPreviewPayload.majorVersion,
      minorNumber: datasetPreviewPayload.minorVersion,
      state: datasetPreviewPayload.versionState as DatasetVersionState,
      createTime: new Date(datasetPreviewPayload.createdAt),
      lastUpdateTime: datasetPreviewPayload.updatedAt,
      ...(datasetPreviewPayload.published_at && {
        releaseTime: new Date(datasetPreviewPayload.published_at)
      })
    },
    citation: datasetPreviewPayload.citationHtml,
    description: datasetPreviewPayload.description,
    publicationStatuses: publicationStatuses,
    parentCollectionAlias: datasetPreviewPayload.identifier_of_dataverse,
    parentCollectionName: datasetPreviewPayload.name_of_dataverse,
    ...(datasetPreviewPayload.image_url && {
      imageUrl: datasetPreviewPayload.image_url
    }),
    ...(collections && { collections }),
    ...(metadataBlocks && { metadataBlocks })
  }
}

export const transformMyDataDatasetPreviewPayloadToDatasetPreview = (
  datasetPreviewPayload: MyDataDatasetPreviewPayload
): DatasetPreview => {
  const publicationStatuses: PublicationStatus[] = []
  datasetPreviewPayload.publicationStatuses.forEach((element) => {
    publicationStatuses.push(element as unknown as PublicationStatus)
  })
  return {
    type: CollectionItemType.DATASET,
    persistentId: datasetPreviewPayload.global_id,
    title: datasetPreviewPayload.name,
    versionId: datasetPreviewPayload.versionId,
    versionInfo: {
      majorNumber: datasetPreviewPayload.majorVersion,
      minorNumber: datasetPreviewPayload.minorVersion,
      state: datasetPreviewPayload.versionState as DatasetVersionState,
      createTime: new Date(datasetPreviewPayload.createdAt),
      lastUpdateTime: datasetPreviewPayload.updatedAt,
      ...(datasetPreviewPayload.published_at && {
        releaseTime: new Date(datasetPreviewPayload.published_at)
      })
    },
    citation: datasetPreviewPayload.citationHtml,
    description: datasetPreviewPayload.description,
    publicationStatuses: publicationStatuses,
    parentCollectionAlias: datasetPreviewPayload.identifier_of_dataverse,
    parentCollectionName: datasetPreviewPayload.name_of_dataverse,
    ...(datasetPreviewPayload.image_url && {
      imageUrl: datasetPreviewPayload.image_url
    }),
    userRoles: datasetPreviewPayload.user_roles
  }
}
