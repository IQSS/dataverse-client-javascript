import {
  ApiConfig,
  createDataset,
  publishDataset,
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

  test('should throw an error when trying to publish a dataset that does not exist', async () => {
    const nonExistentTestDatasetId = 'non-existent-dataset'
    const expectedError = new WriteError(
      `[404] Dataset with Persistent ID ${nonExistentTestDatasetId} not found.`
    )

    await expect(
      publishDataset.execute(nonExistentTestDatasetId, VersionUpdateType.MAJOR)
    ).rejects.toThrow(expectedError)
  })
})
