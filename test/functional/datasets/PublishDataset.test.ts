import {
  ApiConfig,
  createDataset,
  publishDataset,
  VersionUpdateType,
  WriteError
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { waitForNoLocks } from '../../testHelpers/datasets/datasetHelper'

const testNewDataset = {
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
    const dataset = await createDataset.execute(testNewDataset)

    const response = await publishDataset.execute(dataset.persistentId, VersionUpdateType.MAJOR)
    await waitForNoLocks(dataset.numericId, 10)

    expect(response).toBeUndefined()
  })

  test('should throw an error when trying to publish a dataset that does not exist', async () => {
    const nonExistentTestDatasetId = 'non-existent-dataset'
    const expectedError = new WriteError(
      `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
    )

    await expect(
      publishDataset.execute(nonExistentTestDatasetId, VersionUpdateType.MAJOR)
    ).rejects.toThrow(expectedError)
  })
})
