import { DatasetPreview } from '../../../src/datasets/domain/models/DatasetPreview'
import { DatasetVersionState } from '../../../src/datasets/domain/models/Dataset'
import { DatasetPreviewPayload } from '../../../src/datasets/infra/repositories/transformers/DatasetPreviewPayload'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'

const DATASET_CREATE_TIME_STR = '2023-05-15T08:21:01Z'
const DATASET_UPDATE_TIME_STR = '2023-05-15T08:21:03Z'
const DATASET_RELEASE_TIME_STR = '2023-05-15T08:21:03Z'

const DATASET_CITATION =
  'Doe, John, 2023, "Test Dataset 1", https://doi.org/10.5072/FK2/XXXXXX, Root, V1, UNF:6:AAc5A5tAI9AVodAAAsOysA== [fileUNF]'

export const createDatasetPreviewModel = (): DatasetPreview => {
  const datasetPreviewModel: DatasetPreview = {
    persistentId: 'doi:10.5072/FK2/HC6KTB',
    title: 'Test Dataset 1',
    versionId: 19,
    versionInfo: {
      majorNumber: 1,
      minorNumber: 0,
      state: DatasetVersionState.RELEASED,
      createTime: new Date(DATASET_CREATE_TIME_STR),
      lastUpdateTime: new Date(DATASET_UPDATE_TIME_STR),
      releaseTime: new Date(DATASET_RELEASE_TIME_STR)
    },
    citation: DATASET_CITATION,
    description: 'test',
    publicationStatuses: [PublicationStatus.Draft, PublicationStatus.Unpublished]
  }
  return datasetPreviewModel
}

export const createDatasetPreviewPayload = (): DatasetPreviewPayload => {
  return {
    global_id: 'doi:10.5072/FK2/HC6KTB',
    name: 'Test Dataset 1',
    versionId: 19,
    majorVersion: 1,
    minorVersion: 0,
    versionState: DatasetVersionState.RELEASED.toString(),
    createdAt: DATASET_CREATE_TIME_STR,
    updatedAt: DATASET_UPDATE_TIME_STR,
    published_at: DATASET_RELEASE_TIME_STR,
    citation: DATASET_CITATION,
    description: 'test',
    type: 'dataset',
    publicationStatuses: ['Draft', 'Unpublished']
  }
}
