import {
  createDataset,
  CreatedDatasetIdentifiers,
  updateDataset,
  getDataset
} from '../../../src/datasets'
import { ApiConfig } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { DatasetDescription } from '../../../src/datasets/domain/models/Dataset'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update create a dataset when required fields are sent', async () => {
    const testDataset = {
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

    let createdDatasetIdentifiers: CreatedDatasetIdentifiers
    try {
      createdDatasetIdentifiers = await createDataset.execute(testDataset)
    } catch (error) {
      throw new Error('Dataset should be created')
    }

    const datasetId = createdDatasetIdentifiers.numericId
    const updatedDsDescription = 'This is the updated description of the dataset.'
    testDataset.metadataBlockValues[0].fields.dsDescription[0].dsDescriptionValue =
      updatedDsDescription
    await updateDataset.execute(datasetId, testDataset)

    const updatedDataset = await getDataset.execute(datasetId)
    expect(
      (updatedDataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription)
        .dsDescriptionValue
    ).toEqual(updatedDsDescription)
  })
})
