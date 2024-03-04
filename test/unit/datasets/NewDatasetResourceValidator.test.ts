import { NewDatasetResourceValidator } from '../../../src/datasets/domain/useCases/validators/NewDatasetResourceValidator'
import {
  createNewDatasetDTO,
  createNewDatasetMetadataBlockModel,
  createNewDatasetDTOWithoutFirstLevelRequiredField
} from '../../testHelpers/datasets/newDatasetHelper'
import { FieldValidationError } from '../../../src/datasets/domain/useCases/validators/errors/FieldValidationError'
import { NewDatasetDTO } from '../../../src/datasets/domain/dtos/NewDatasetDTO'
import { SingleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/SingleMetadataFieldValidator'
import { MetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MetadataFieldValidator'
import { MultipleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MultipleMetadataFieldValidator'

describe('validate', () => {
  const testMetadataBlocks = [createNewDatasetMetadataBlockModel()]

  const singleMetadataFieldValidator = new SingleMetadataFieldValidator()
  const metadataFieldValidator = new MetadataFieldValidator(
    new SingleMetadataFieldValidator(),
    new MultipleMetadataFieldValidator(singleMetadataFieldValidator)
  )
  const sut = new NewDatasetResourceValidator(metadataFieldValidator)

  const runValidateExpectingFieldValidationError = (
    newDataset: NewDatasetDTO,
    expectedMetadataFieldName: string,
    expectedErrorMessage: string,
    expectedParentMetadataFieldName?: string,
    expectedPosition?: number
  ) => {
    try {
      sut.validate(newDataset, testMetadataBlocks)
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
    const testNewDataset = createNewDatasetDTO()
    expect(() => sut.validate(testNewDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise an empty field error when a first level required string field is missing', () => {
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      createNewDatasetDTOWithoutFirstLevelRequiredField(),
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.'
    )
  })

  test('should raise an empty field error when a first level required array field is empty', () => {
    expect.assertions(6)
    const testNewDataset = createNewDatasetDTO(undefined, [], undefined)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.'
    )
  })

  test('should raise an error when the provided field value for a unique field is an array', () => {
    expect.assertions(6)
    const testNewDataset = createNewDatasetDTO(['title1', 'title2'], undefined, undefined)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a single field, not an array.'
    )
  })

  test('should raise an error when the provided field value is an object and the field expects a string', () => {
    const testNewDataset = createNewDatasetDTO(
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' },
      undefined,
      undefined
    )
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a string, not child fields.'
    )
  })

  test('should raise an error when the provided field value for a multiple field is a string', () => {
    const testNewDataset = createNewDatasetDTO(undefined, 'invalidValue', undefined)
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.'
    )
  })

  test('should raise an error when the provided field value is an array of strings and the field expects an array of objects', () => {
    const invalidAuthorFieldValue = ['invalidValue1', 'invalidValue2']
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined)
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of child fields, not strings.'
    )
  })

  test('should raise an error when the provided field value is an array of objects and the field expects an array of strings', () => {
    const invalidAlternativeTitleFieldValue = [
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' },
      { invalidChildField1: 'invalid value 1', invalidChildField2: 'invalid value 2' }
    ]
    const testNewDataset = createNewDatasetDTO(
      undefined,
      undefined,
      invalidAlternativeTitleFieldValue
    )
    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'alternativeRequiredTitle',
      'There was an error when validating the field alternativeRequiredTitle from metadata block citation. Reason was: Expecting an array of strings, not child fields.'
    )
  })

  test('should raise an empty field error when a required child field is missing', () => {
    const invalidAuthorFieldValue = [
      { authorName: 'Admin, Dataverse', authorAffiliation: 'Dataverse.org' },
      { authorAffiliation: 'Dataverse.org' }
    ]
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined)

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'authorName',
      'There was an error when validating the field authorName from metadata block citation with parent field author in position 1. Reason was: The field should not be empty.',
      'author',
      1
    )
  })

  test('should not raise an empty field error when a not required child field is missing', () => {
    const authorFieldValue = [
      { authorName: 'Admin, Dataverse', authorAffiliation: 'Dataverse.org' },
      { authorName: 'John, Doe' }
    ]
    const testNewDataset = createNewDatasetDTO(undefined, authorFieldValue, undefined)
    expect(() => sut.validate(testNewDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise a date format validation error when a date field has an invalid format', () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, '1-1-2020')

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'timePeriodCoveredStart',
      'There was an error when validating the field timePeriodCoveredStart from metadata block citation. Reason was: The field requires a valid date format (YYYY-MM-DD).'
    )
  })

  test('should not raise a date format validation error when a date field has a valid format', () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, '2020-01-01')
    expect(() => sut.validate(testNewDataset, testMetadataBlocks)).not.toThrow()
  })

  test('should raise a controlled vocabulary error when a controlled vocabulary field has an invalid format', () => {
    const testNewDataset = createNewDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      'Wrong Value'
    )

    expect.assertions(6)
    runValidateExpectingFieldValidationError(
      testNewDataset,
      'contributorType',
      'There was an error when validating the field contributorType from metadata block citation with parent field contributor. Reason was: The field does not have a valid controlled vocabulary value.',
      'contributor',
      0
    )
  })

  test('should not raise a controlled vocabulary error when the value for a controlled vocabulary field is correct', () => {
    const testNewDataset = createNewDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      'Project Member'
    )
    expect(() => sut.validate(testNewDataset, testMetadataBlocks)).not.toThrow()
  })
})
