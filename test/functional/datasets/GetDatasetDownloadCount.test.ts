import {
  getDatasetDownloadCount,
  createDataset,
  publishDataset,
  VersionUpdateType
} from '../../../src/datasets'
import { ApiConfig, ReadError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  deletePublishedDatasetViaApi,
  deleteUnpublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'

const testDataset = {
  license: {
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  metadataBlockValues: [
    {
      name: 'citation',
      fields: {
        title: 'Dataset for download count testing',
        author: [
          {
            authorName: 'Test, User',
            authorAffiliation: 'Dataverse.org'
          }
        ],
        datasetContact: [
          {
            datasetContactEmail: 'testuser@mailinator.com',
            datasetContactName: 'User, Test'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'This dataset is used for testing the download count API.'
          }
        ],
        subject: ['Computer Science']
      }
    }
  ]
}

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return download count for a dataset', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    await publishDataset.execute(createdDatasetIdentifiers.persistentId, VersionUpdateType.MAJOR)

    const downloadCount = await getDatasetDownloadCount.execute(createdDatasetIdentifiers.numericId)

    expect(downloadCount).toBe(0)

    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })

  test('should return download count including MDC data', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    await publishDataset.execute(createdDatasetIdentifiers.persistentId, VersionUpdateType.MAJOR)

    const downloadCount = await getDatasetDownloadCount.execute(
      createdDatasetIdentifiers.numericId,
      true
    )

    expect(downloadCount).toBe(0)

    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })

  test('should throw an error when dataset ID is invalid', async () => {
    await expect(getDatasetDownloadCount.execute(999999)).rejects.toBeInstanceOf(ReadError)
  })

  test('should return zero if dataset has no downloads', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const downloadCount = await getDatasetDownloadCount.execute(createdDatasetIdentifiers.numericId)

    expect(downloadCount).toBe(0)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })
})
