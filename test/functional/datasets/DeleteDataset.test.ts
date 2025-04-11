import {
  createDataset,
  publishDataset,
  VersionUpdateType,
  deleteDataset
} from '../../../src/datasets'
import { ApiConfig, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { waitForNoLocks } from '../../testHelpers/datasets/datasetHelper'

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

  test('should delete a dataset when it is published successfully', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const response = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.MAJOR
    )

    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    expect(response).toBeUndefined()

    const actual = await deleteDataset.execute(createdDatasetIdentifiers.numericId)

    expect(actual).toBeUndefined()
  })

  test('should delete a dataset when it is not published successfully', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const actual = await deleteDataset.execute(createdDatasetIdentifiers.numericId)

    expect(actual).toBeUndefined()
  })

  test('should throw an error when the dataset id is incorrect', async () => {
    await expect(deleteDataset.execute(1111)).rejects.toBeInstanceOf(WriteError)
  })
})
