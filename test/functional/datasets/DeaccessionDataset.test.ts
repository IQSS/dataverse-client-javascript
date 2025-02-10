import {
  deaccessionDataset,
  DatasetDeaccessionDTO,
  createDataset,
  publishDataset,
  VersionUpdateType
} from '../../../src/datasets'
import { ApiConfig, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  waitForNoLocks,
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

  test('should deaccession a dataset when required fields are sent', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const response = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.MAJOR
    )
    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    expect(response).toBeUndefined()

    const testDeaccessionDatasetDTO: DatasetDeaccessionDTO = {
      deaccessionReason: 'Description of the deaccession reason.',
      deaccessionForwardURL: 'https://demo.dataverse.org'
    }

    const actual = await deaccessionDataset.execute(
      createdDatasetIdentifiers.numericId,
      '1.0',
      testDeaccessionDatasetDTO
    )

    expect(actual).toBeUndefined()

    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })

  test('should throw an error when the dataset id is incorrect', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const testDeaccessionDatasetDTO: DatasetDeaccessionDTO = {
      deaccessionReason: 'Description of the deaccession reason.',
      deaccessionForwardURL: 'https://demo.dataverse.org'
    }

    await expect(
      deaccessionDataset.execute(
        createdDatasetIdentifiers.numericId,
        ':latest-published',
        testDeaccessionDatasetDTO
      )
    ).rejects.toThrow(Error)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  test('should not deaccession a dataset when it is not published', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)
    const testDeaccessionDatasetDTO: DatasetDeaccessionDTO = {
      deaccessionReason: 'Description of the deaccession reason.'
    }

    await expect(
      deaccessionDataset.execute(
        createdDatasetIdentifiers.numericId,
        ':latest-published',
        testDeaccessionDatasetDTO
      )
    ).rejects.toBeInstanceOf(WriteError)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  test('should not deaccession a dataset when it is deaccessioned once', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testDataset)

    const response = await publishDataset.execute(
      createdDatasetIdentifiers.persistentId,
      VersionUpdateType.MAJOR
    )
    await waitForNoLocks(createdDatasetIdentifiers.numericId, 10)

    expect(response).toBeUndefined()

    const testDeaccessionDatasetDTO: DatasetDeaccessionDTO = {
      deaccessionReason: 'Description of the deaccession reason.',
      deaccessionForwardURL: 'https://demo.dataverse.org'
    }

    const actual = await deaccessionDataset.execute(
      createdDatasetIdentifiers.numericId,
      '1.0',
      testDeaccessionDatasetDTO
    )

    expect(actual).toBeUndefined()

    await expect(
      deaccessionDataset.execute(
        createdDatasetIdentifiers.numericId,
        '1.0',
        testDeaccessionDatasetDTO
      )
    ).rejects.toThrow(Error)

    await deletePublishedDatasetViaApi(createdDatasetIdentifiers.persistentId)
  })
})
