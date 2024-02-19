import { NewDatasetResourceValidator } from '../../../src/datasets/domain/useCases/validators/NewDatasetResourceValidator';
import { assert } from 'sinon';
import {
  createNewDatasetDTO,
  createNewDatasetMetadataBlockModel,
  createNewDatasetDTOWithoutFirstLevelRequiredField,
} from '../../testHelpers/datasets/newDatasetHelper';
import { fail } from 'assert';
import { EmptyFieldError } from '../../../src/datasets/domain/useCases/validators/errors/EmptyFieldError';
import { FieldValidationError } from '../../../src/datasets/domain/useCases/validators/errors/FieldValidationError';
import { NewDatasetDTO, NewDatasetMetadataFieldValueDTO } from '../../../src/datasets/domain/dtos/NewDatasetDTO';
import { SingleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/SingleMetadataFieldValidator';
import { MetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MetadataFieldValidator';
import { MultipleMetadataFieldValidator } from '../../../src/datasets/domain/useCases/validators/MultipleMetadataFieldValidator';

describe('validate', () => {
  const testMetadataBlocks = [createNewDatasetMetadataBlockModel()];

  const singleMetadataFieldValidator = new SingleMetadataFieldValidator();
  const metadataFieldValidator = new MetadataFieldValidator(
    new SingleMetadataFieldValidator(),
    new MultipleMetadataFieldValidator(singleMetadataFieldValidator),
  );
  const sut = new NewDatasetResourceValidator(metadataFieldValidator);

  async function runValidateExpectingFieldValidationError<T extends FieldValidationError>(
    newDataset: NewDatasetDTO,
    expectedMetadataFieldName: string,
    expectedErrorMessage: string,
    expectedParentMetadataFieldName?: string,
    expectedPosition?: number,
  ): Promise<void> {
    await sut
      .validate(newDataset, testMetadataBlocks)
      .then(() => {
        fail('Validation should fail');
      })
      .catch((error) => {
        const fieldValidationError = error as T;
        assert.match(fieldValidationError.citationBlockName, 'citation');
        assert.match(fieldValidationError.metadataFieldName, expectedMetadataFieldName);
        assert.match(fieldValidationError.parentMetadataFieldName, expectedParentMetadataFieldName);
        assert.match(fieldValidationError.fieldPosition, expectedPosition);
        assert.match(fieldValidationError.message, expectedErrorMessage);
      });
  }

  test('should not raise a validation error when a new dataset with only the required fields is valid', async () => {
    const testNewDataset = createNewDatasetDTO();
    await sut.validate(testNewDataset, testMetadataBlocks).catch((e) => fail(e));
  });

  test('should raise an empty field error when a first level required string field is missing', async () => {
    await runValidateExpectingFieldValidationError<EmptyFieldError>(
      createNewDatasetDTOWithoutFirstLevelRequiredField(),
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
    );
  });

  test('should raise an empty field error when a first level required array field is empty', async () => {
    const invalidAuthorFieldValue: NewDatasetMetadataFieldValueDTO = [];
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
    );
  });

  test('should raise an error when the provided field value for an unique field is an array', async () => {
    const invalidTitleFieldValue = ['title1', 'title2'];
    const testNewDataset = createNewDatasetDTO(invalidTitleFieldValue, undefined, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a single field, not an array.',
    );
  });

  test('should raise an error when the provided field value is an object and the field expects a string', async () => {
    const invalidTitleFieldValue = {
      invalidChildField1: 'invalid value 1',
      invalidChildField2: 'invalid value 2',
    };
    const testNewDataset = createNewDatasetDTO(invalidTitleFieldValue, undefined, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a string, not child fields.',
    );
  });

  test('should raise an error when the provided field value for a multiple field is a string', async () => {
    const invalidAuthorFieldValue = 'invalidValue';
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.',
    );
  });

  test('should raise an error when the provided field value is an array of strings and the field expects an array of objects', async () => {
    const invalidAuthorFieldValue = ['invalidValue1', 'invalidValue2'];
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of child fields, not strings',
    );
  });

  test('should raise an error when the provided field value is an array of objects and the field expects an array of strings', async () => {
    const invalidAlternativeTitleFieldValue = [
      {
        invalidChildField1: 'invalid value 1',
        invalidChildField2: 'invalid value 2',
      },
      {
        invalidChildField1: 'invalid value 1',
        invalidChildField2: 'invalid value 2',
      },
    ];
    const testNewDataset = createNewDatasetDTO(undefined, undefined, invalidAlternativeTitleFieldValue);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'alternativeRequiredTitle',
      'There was an error when validating the field alternativeRequiredTitle from metadata block citation. Reason was: Expecting an array of strings, not child fields',
    );
  });

  test('should raise an empty field error when a required child field is missing', async () => {
    const invalidAuthorFieldValue = [
      {
        authorName: 'Admin, Dataverse',
        authorAffiliation: 'Dataverse.org',
      },
      {
        authorAffiliation: 'Dataverse.org',
      },
    ];
    const testNewDataset = createNewDatasetDTO(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'authorName',
      'There was an error when validating the field authorName from metadata block citation with parent field author in position 1. Reason was: The field should not be empty.',
      'author',
      1,
    );
  });

  test('should not raise an empty field error when a not required child field is missing', async () => {
    const authorFieldValue = [
      {
        authorName: 'Admin, Dataverse',
        authorAffiliation: 'Dataverse.org',
      },
      {
        authorName: 'John, Doe',
      },
    ];
    const testNewDataset = createNewDatasetDTO(undefined, authorFieldValue, undefined);
    await sut.validate(testNewDataset, testMetadataBlocks).catch((e) => fail(e));
  });

  test('should raise a date format validation error when a date field has an invalid format', async () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, '1-1-2020');
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'timePeriodCoveredStart',
      'There was an error when validating the field timePeriodCoveredStart from metadata block citation. Reason was: The field requires a valid date format (YYYY-MM-DD).',
    );
  });

  test('should not raise a date format validation error when a date field has a valid format', async () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, '2020-01-01');
    await sut.validate(testNewDataset, testMetadataBlocks).catch((e) => fail(e));
  });

  test('should raise a controlled vocabulary error when a controlled vocabulary field has an invalid format', async () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, undefined, 'Wrong Value');
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'contributorType',
      'There was an error when validating the field contributorType from metadata block citation with parent field contributor. Reason was: The field does not have a valid controlled vocabulary value.',
      'contributor',
      0,
    );
  });

  test('should not raise a controlled vocabulary error when the value for a controlled vocabulary field is correct', async () => {
    const testNewDataset = createNewDatasetDTO(undefined, undefined, undefined, undefined, 'Project Member');
    await sut.validate(testNewDataset, testMetadataBlocks).catch((e) => fail(e));
  });
});