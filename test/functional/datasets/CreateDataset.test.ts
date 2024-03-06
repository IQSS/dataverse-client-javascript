import { createDataset } from '../../../src/datasets'
import { ApiConfig } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully create a new dataset when all required fields are sent', async () => {
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
    await createDataset.execute(testNewDataset).catch(() => {
      throw new Error('Dataset should be created')
    })
  })
})
