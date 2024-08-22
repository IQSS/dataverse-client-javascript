import { AxiosResponse } from 'axios'
import { DatasetPreview } from '../../../domain/models/DatasetPreview'
import { DatasetVersionState } from '../../../domain/models/Dataset'
import { DatasetPreviewSubset } from '../../../domain/models/DatasetPreviewSubset'
import { DatasetPreviewPayload } from './DatasetPreviewPayload'
import { PublicationStatus } from '../../../../core/domain/models/PublicationStatus'

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
  datasetPreviewPayload: DatasetPreviewPayload
): DatasetPreview => {
  let publicationStatuses: PublicationStatus[] = []
  datasetPreviewPayload.publicationStatuses.forEach((element) => {
    publicationStatuses.push(element as unknown as PublicationStatus)
  })
  return {
    persistentId: datasetPreviewPayload.global_id,
    title: datasetPreviewPayload.name,
    versionId: datasetPreviewPayload.versionId,
    versionInfo: {
      majorNumber: datasetPreviewPayload.majorVersion,
      minorNumber: datasetPreviewPayload.minorVersion,
      state: datasetPreviewPayload.versionState as DatasetVersionState,
      createTime: new Date(datasetPreviewPayload.createdAt),
      lastUpdateTime: new Date(datasetPreviewPayload.updatedAt),
      ...(datasetPreviewPayload.published_at && {
        releaseTime: new Date(datasetPreviewPayload.published_at)
      })
    },
    citation: datasetPreviewPayload.citation,
    description: datasetPreviewPayload.description,
    publicationStatuses: publicationStatuses
  }
}
