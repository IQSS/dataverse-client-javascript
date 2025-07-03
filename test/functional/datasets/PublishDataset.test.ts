import {
  ApiConfig,
  createDataset,
  publishDataset,
  updateDataset,
  VersionUpdateType,
  WriteError
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  waitForNoLocks,
  deletePublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'

const testNewDataset = {
  license: {
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  metadataBlockValues: [
    {
      name: 'citation',
      fields: {
        title: 'Dataset created using the createDataset use case',
        author: [
          {
            authorName: 'Admin, Dataverse',
            authorAffiliation: 'Dataverse.org'
          },
          {
            authorName: 'Owner, Dataverse',
            authorAffiliation: 'Dataversedemo.org'
          }
        ],
        datasetContact: [
          {
            datasetContactEmail: 'finch@mailinator.com',
            datasetContactName: 'Finch, Fiona'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'This is the description of the dataset.'
          }
        ],
        subject: ['Medicine, Health and Life Sciences']
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

  test('should successfully publish a dataset', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const response = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.MAJOR
    )
    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    expect(response).toBeUndefined()
    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })

  test('should successfully publish a dataset with update current version', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const firstPublishResponse = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.MAJOR
    )
    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    await updateDataset.execute(createdDatasetIdentifiers.numericId, testNewDataset)

    const secondPublishResponse = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.UPDATE_CURRENT
    )
    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    expect(firstPublishResponse).toBeUndefined()
    expect(secondPublishResponse).toBeUndefined()
    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })

  test('should throw an error when trying to publish a dataset that does not exist', async () => {
    const nonExistentTestDatasetId = 'non-existent-dataset'
    const expectedError = new WriteError(
      `[400] Bad dataset ID number: ${nonExistentTestDatasetId}.`
    )

    await expect(
      publishDataset.execute(nonExistentTestDatasetId, VersionUpdateType.MAJOR)
    ).rejects.toThrow(expectedError)
  })

  test('should throw an error when trying to publish with the current version a dataset that has never been published before', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    await expect(
      publishDataset.execute(createdDatasetIdentifiers.numericId, VersionUpdateType.UPDATE_CURRENT)
    ).rejects.toBeInstanceOf(WriteError)

    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })
})
