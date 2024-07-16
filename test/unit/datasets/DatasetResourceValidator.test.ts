import { DatasetResourceValidator } from '../../../src/datasets/domain/useCases/validators/DatasetResourceValidator'
import {
  createDatasetDTO,
  createDatasetMetadataBlockModel,
  createDatasetDTOWithoutFirstLevelRequiredField
} from '../../testHelpers/datasets/datasetHelper'
import { FieldValidationError } from '../../../src/datasets/domain/useCases/validators/errors/FieldValidationError'
import {
  DatasetDTO,
  DatasetMetadataChildFieldValueDTO
} from '../../../src/datasets/domain/dtos/DatasetDTO'
import { SingleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/SingleMetadataFieldValidator'
import { MetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MetadataFieldValidator'
import { MultipleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MultipleMetadataFieldValidator'

describe('validate', () => {
  const testMetadataBlocks = [createDatasetMetadataBlockModel()]

  const singleMetadataFieldValidator = new SingleMetadataFieldValidator()
  const metadataFieldValidator = new MetadataFieldValidator(
    new SingleMetadataFieldValidator(),
    new MultipleMetadataFieldValidator(singleMetadataFieldValidator)
  )
  const sut = new DatasetResourceValidator(metadataFieldValidator)

  const runValidateExpectingFieldValidationError = (
    dataset: DatasetDTO,
    expectedMetadataFieldName: string,
    expectedErrorMessage: string,
    expectedParentMetadataFieldName?: string,
    expectedPosition?: number
  ) => {
    try {
      sut.validate(dataset, testMetadataBlocks)
      throw new Error('Validation should fail')
    } catch (error) {
      expect(error).toBeInstanceOf(FieldValidationError)
      expect(error.citationBlockName).toEqual('citation')
      expect(error.metadataFieldName).toEqual(expectedMetadataFieldName)
      expect(error.parentMetadataFieldName).toEqual(expectedParentMetadataFieldName)
      expect(error.fieldPosition).toEqual(expectedPosition)
      expect(error.message).toEqual(expectedErrorMessage)
    }
  }

  test('should not raise a validation error when a new dataset with only the required fields is valid', () => {
    const testDataset = createDatasetDTO()
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise an empty field error when a first level required string field is missing', () => {
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      createDatasetDTOWithoutFirstLevelRequiredField(),
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.'
    )
  })

  test('should raise an empty field error when a first level required array field is empty', () => {
    expect.assertions(6)
    const testDataset = createDatasetDTO(undefined, [], undefined)
    runValidateExpectingFieldValidationError(
      testDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.'
    )
  })

  test('should raise an error when the provided field value for a unique field is an array', () => {
    expect.assertions(6)
    const testDataset = createDatasetDTO(['title1', 'title2'], undefined, undefined)
    runValidateExpectingFieldValidationError(
      testDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a single field, not an array.'
    )
  })

  test('should raise an error when the provided field value is an object and the field expects a string', () => {
    const testDataset = createDatasetDTO(
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' },
      undefined,
      undefined
    )
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a string, not child fields.'
    )
  })

  test('should raise an error when the provided field value for a multiple field is a string', () => {
    const testDataset = createDatasetDTO(undefined, 'invalidValue', undefined)
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.'
    )
  })

  test('should raise an error when the provided field value is an array of strings and the field expects an array of objects', () => {
    const invalidAuthorFieldValue = ['invalidValue1', 'invalidValue2']
    const testDataset = createDatasetDTO(undefined, invalidAuthorFieldValue, undefined)
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of child fields, not strings.'
    )
  })

  test('should raise an error when the provided field value is an array of objects and the field expects an array of strings', () => {
    const invalidAlternativeTitleFieldValue = [
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' },
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' }
    ]
    const testDataset = createDatasetDTO(undefined, undefined, invalidAlternativeTitleFieldValue)
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'alternativeRequiredTitle',
      'There was an error when validating the field alternativeRequiredTitle from metadata block citation. Reason was: Expecting an array of strings, not child fields.'
    )
  })

  test('should raise an empty field error when a required child field is missing', () => {
    const invalidAuthorFieldValue: DatasetMetadataChildFieldValueDTO[] = [
      { authorName: 'Admin, Dataverse', authorAffiliation: 'Dataverse.org' },
      { authorAffiliation: 'Dataverse.org' }
    ]
    const testDataset = createDatasetDTO(undefined, invalidAuthorFieldValue, undefined)

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'authorName',
      'There was an error when validating the field authorName from metadata block citation with parent field author in position 1. Reason was: The field should not be empty.',
      'author',
      1
    )
  })

  test('should not raise an empty field error when a not required child field is missing', () => {
    const authorFieldValue: DatasetMetadataChildFieldValueDTO[] = [
      { authorName: 'Admin, Dataverse', authorAffiliation: 'Dataverse.org' },
      { authorName: 'John, Doe' }
    ]
    const testDataset = createDatasetDTO(undefined, authorFieldValue, undefined)
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise a date format validation error when a date field has an invalid format', () => {
    const testDataset = createDatasetDTO(undefined, undefined, undefined, '1-1-2020')

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'timePeriodCoveredStart',
      'There was an error when validating the field timePeriodCoveredStart from metadata block citation. Reason was: The field requires a valid date format (YYYY or YYYY-MM or YYYY-MM-DD).'
    )
  })

  test('should not raise a date format validation error when a date field has a valid YYYY-MM-DD format', () => {
    const testDataset = createDatasetDTO(undefined, undefined, undefined, '2020-01-01')
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should not raise a date format validation error when a date field has a valid YYYY-MM format', () => {
    const testDataset = createDatasetDTO(undefined, undefined, undefined, '2020-01')
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should not raise a date format validation error when a date field has a valid YYYY format', () => {
    const testDataset = createDatasetDTO(undefined, undefined, undefined, '2020')
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise a date format validation error when a date field has a wrong date format according to the field watermark', () => {
    const testDataset = createDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '01-03'
    )

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'dateOfCreation',
      'There was an error when validating the field dateOfCreation from metadata block citation. Reason was: The field requires a valid date format (YYYY-MM-DD).'
    )
  })

  test('should not raise a date format validation error when a date field has a valid format according to the field watermark', () => {
    const testDataset = createDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '2024-01-03'
    )
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise a controlled vocabulary error when a controlled vocabulary field has an invalid format', () => {
    const testDataset = createDatasetDTO(undefined, undefined, undefined, undefined, 'Wrong Value')

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testDataset,
      'contributorType',
      'There was an error when validating the field contributorType from metadata block citation with parent field contributor in position 0. Reason was: The field does not have a valid controlled vocabulary value.',
      'contributor',
      0
    )
  })

  test('should not raise a controlled vocabulary error when the value for a controlled vocabulary field is correct', () => {
    const testDataset = createDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      'Project Member'
    )
    expect(() => sut.validate(testDataset, testMetadataBlocks)).not.toThrow()
  })
})
