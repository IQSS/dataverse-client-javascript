import { ApiConfig, createDataset, getDataset, ReadError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { DatasetDescription } from '../../../src/datasets/domain/models/Dataset'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

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
            dsDescriptionValue: 'Hello <b>world</b>'
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

  test('should successfully get a dataset when a valid id is sent', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const dataset = await getDataset.execute(createdDatasetIdentifiers.numericId)
    expect(dataset).not.toBeNull()
    expect(dataset.id).toBe(createdDatasetIdentifiers.numericId)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  test('should successfully get a dataset when a valid persistent id is sent', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const dataset = await getDataset.execute(createdDatasetIdentifiers.persistentId)
    expect(dataset).not.toBeNull()
    expect(dataset.id).toBe(createdDatasetIdentifiers.numericId)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  test('should throw an error when an invalid id is sent', async () => {
    const nonExistentTestDatasetId = 'non-existent-dataset'
    const expectedError = new ReadError(`[400] Bad dataset ID number: ${nonExistentTestDatasetId}.`)

    await expect(getDataset.execute(nonExistentTestDatasetId)).rejects.toThrow(expectedError)
  })

  test('should return metadata fields in markdown format when keepRawFields is false', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const dataset = await getDataset.execute(
      createdDatasetIdentifiers.numericId,
      undefined,
      false,
      false
    )

    expect(
      (dataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription).dsDescriptionValue
    ).toBe('Hello **world**')

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  test('should not return metadata fields in markdown format when keepRawFields is true', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(testNewDataset)

    const dataset = await getDataset.execute(
      createdDatasetIdentifiers.numericId,
      undefined,
      false,
      true
    )

    expect(
      (dataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription).dsDescriptionValue
    ).toBe('Hello <b>world</b>')

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })
})
