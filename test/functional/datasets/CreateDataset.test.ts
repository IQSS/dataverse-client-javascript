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
    expect.assertions(5)
    let fieldValidationError: FieldValidationError
    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      fieldValidationError = error
    } finally {
      expect(fieldValidationError).toBeInstanceOf(FieldValidationError)
      expect(fieldValidationError.citationBlockName).toEqual('citation')
      expect(fieldValidationError.metadataFieldName).toEqual('title')
      expect(fieldValidationError.parentMetadataFieldName).toEqual(undefined)
      expect(fieldValidationError.message).toEqual(
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
    expect.assertions(6)
    let fieldValidationError: FieldValidationError
    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      fieldValidationError = error
    } finally {
      expect(fieldValidationError).toBeInstanceOf(FieldValidationError)
      expect(fieldValidationError.citationBlockName).toEqual('citation')
      expect(fieldValidationError.metadataFieldName).toEqual('authorName')
      expect(fieldValidationError.parentMetadataFieldName).toEqual('author')
      expect(fieldValidationError.fieldPosition).toEqual(0)
      expect(fieldValidationError.message).toEqual(
        'There was an error when validating the field authorName from metadata block citation with parent field author in position 0. Reason was: The field should not be empty.'
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
            subject: ['Medicine, Health and Life Sciences', 'Wrong subject']
          }
        }
      ]
    }
    expect.assertions(6)
    let fieldValidationError: FieldValidationError
    try {
      await createDataset.execute(testNewDataset)
      throw new Error('Use case should throw an error')
    } catch (error) {
      fieldValidationError = error
    } finally {
      expect(fieldValidationError).toBeInstanceOf(FieldValidationError)
      expect(fieldValidationError.citationBlockName).toEqual('citation')
      expect(fieldValidationError.metadataFieldName).toEqual('subject')
      expect(fieldValidationError.parentMetadataFieldName).toEqual(undefined)
      expect(fieldValidationError.fieldPosition).toEqual(1)
      expect(fieldValidationError.message).toEqual(
        'There was an error when validating the field subject from metadata block citation in position 1. Reason was: The field does not have a valid controlled vocabulary value.'
      )
    }
  })
})
