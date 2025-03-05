import { DatasetVersionSummaryInfo } from '../../../src/datasets/domain/models/DatasetVersionSummaryInfo'

export const createDatasetVersionSummaryModel = (
  props?: Partial<DatasetVersionSummaryInfo>
): DatasetVersionSummaryInfo => ({
  id: 1,
  contributors: 'John Doe',
  versionNumber: 'DRAFT',
  publishedOn: '2021-01-01',
  summary: {
    'Citation Metadata': {
      Title: {
        added: 0,
        deleted: 0,
        changed: 1
      }
    },
    files: {
      added: 0,
      removed: 0,
      replaced: 0,
      changedFileMetaData: 0,
      changedVariableMetadata: 0
    },
    termsAccessChanged: false
  },
  ...props
})
