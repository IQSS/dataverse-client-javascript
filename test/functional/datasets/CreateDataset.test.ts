import { createDataset } from '../../../src/datasets'
import { ApiConfig } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { FieldValidationError } from '../../../src/datasets/domain/useCases/validators/errors/FieldValidationError'

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

  test('should throw an error when a first level required field is missing', async () => {
    const testNewDataset = {
      metadataBlockValues: [
        {
          name: 'citation',
          fields: {
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

    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      expect(error).toBeInstanceOf(FieldValidationError)
      expect(error.citationBlockName).toEqual('citation')
      expect(error.metadataFieldName).toEqual('title')
      expect(error.message).toEqual(
        'There was an error when validating the field title from metadata block citation. Reason was: The field should not be empty.'
      )
    }
  })

  test('should throw an error when a second level required field is missing', async () => {
    const testNewDataset = {
      metadataBlockValues: [
        {
          name: 'citation',
          fields: {
            title: 'Dataset created using the createDataset use case',
            author: [
              {
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

    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      expect(error).toBeInstanceOf(FieldValidationError)
      expect(error.citationBlockName).toEqual('citation')
      expect(error.metadataFieldName).toEqual('authorName')
      expect(error.parentMetadataFieldName).toEqual('author')
      expect(error.fieldPosition).toEqual(0)
      expect(error.message).toEqual(
        'There was an error when validating the field authorName from metadata block citation with parent field author. Reason was: The field should not be empty.'
      )
    }
  })

  test('should throw an error when a controlled vocabulary field has an unsupported value', async () => {
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
            subject: ['Wrong subject']
          }
        }
      ]
    }

    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      expect(error).toBeInstanceOf(FieldValidationError)
      expect(error.citationBlockName).toEqual('citation')
      expect(error.metadataFieldName).toEqual('subject')
      expect(error.message).toEqual(
        'There was an error when validating the field subject from metadata block citation with parent field subject. Reason was: The field does not have a valid controlled vocabulary value.'
      )
    }
  })
})
