import { DatasetVersion, DatasetVersionState } from '../../../src'

export const createDatasetVersionModel = (
  props?: Partial<DatasetVersion>
): DatasetVersion => ({
  id: 1,
  datasetId: 1,
  datasetPersistentId: 'doi:10.5072/FK2/AAENBT',
  datasetType: 'dataset',
  storageIdentifier: 's3://datasets/1',
  internalVersionNumber: 1,
  versionState: DatasetVersionState.DRAFT,
  latestVersionPublishingState: DatasetVersionState.DRAFT,
  isInReviewState: false,
  lastUpdateTime: '2021-01-01T00:00:00Z',
  createTime: '2021-01-01T00:00:00Z',
  publicationDate: '2021-01-01',
  citationDate: '2021-01-01',
  license: {
    'name': 'CC BY 4.0 (Creative Commons Attribution 4.0 International)',
    'uri': 'cc-by',
    'iconUri': 'https://licensebuttons.net/l/by/4.0/88x31.png'
  },
  fileAccessRequest: false,
  ...props
})
