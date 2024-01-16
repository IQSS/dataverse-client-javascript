import { NewDatasetValidator } from '../../../src/datasets/domain/useCases/validators/NewDatasetValidator';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import {
  createNewDatasetModel,
  createNewDatasetMetadataBlockModel,
  createNewDatasetModelWithoutFirstLevelRequiredField,
} from '../../testHelpers/datasets/newDatasetHelper';
import { fail } from 'assert';
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { EmptyFieldError } from '../../../src/core/domain/useCases/validators/errors/EmptyFieldError';
import { FieldValidationError } from '../../../src/core/domain/useCases/validators/errors/FieldValidationError';
import { NewDataset, NewDatasetMetadataFieldValue } from '../../../src/datasets/domain/models/NewDataset';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  function setupMetadataBlocksRepositoryStub(): IMetadataBlocksRepository {
    const testMetadataBlock = createNewDatasetMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    return metadataBlocksRepositoryStub;
  }

  async function runValidateExpectingFieldValidationError<T extends FieldValidationError>(
    newDataset: NewDataset,
    expectedMetadataFieldName: string,
    expectedErrorMessage: string,
    expectedParentMetadataFieldName?: string,
    expectedPosition?: number,
  ): Promise<void> {
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());
    await sut
      .validate(newDataset)
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
    const testNewDataset = createNewDatasetModel();
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());

    await sut.validate(testNewDataset).catch((e) => fail(e));
  });

  test('should raise an empty field error when a first level required string field is missing', async () => {
    await runValidateExpectingFieldValidationError<EmptyFieldError>(
      createNewDatasetModelWithoutFirstLevelRequiredField(),
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
    );
  });

  test('should raise an empty field error when a first level required array field is empty', async () => {
    const invalidAuthorFieldValue: NewDatasetMetadataFieldValue = [];
    const testNewDataset = createNewDatasetModel(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
    );
  });

  test('should raise an error when the provided field value for an unique field is an array', async () => {
    const invalidTitleFieldValue = ['title1', 'title2'];
    const testNewDataset = createNewDatasetModel(invalidTitleFieldValue, undefined, undefined);
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
    const testNewDataset = createNewDatasetModel(invalidTitleFieldValue, undefined, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'title',
      'There was an error when validating the field title from metadata block citation. Reason was: Expecting a string, not child fields.',
    );
  });

  test('should raise an error when the provided field value for a multiple field is a string', async () => {
    const invalidAuthorFieldValue = 'invalidValue';
    const testNewDataset = createNewDatasetModel(undefined, invalidAuthorFieldValue, undefined);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'author',
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.',
    );
  });

  test('should raise an error when the provided field value is an array of strings and the field expects an array of objects', async () => {
    const invalidAuthorFieldValue = ['invalidValue1', 'invalidValue2'];
    const testNewDataset = createNewDatasetModel(undefined, invalidAuthorFieldValue, undefined);
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
    const testNewDataset = createNewDatasetModel(undefined, undefined, invalidAlternativeTitleFieldValue);
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
    const testNewDataset = createNewDatasetModel(undefined, invalidAuthorFieldValue, undefined);
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
    const testNewDataset = createNewDatasetModel(undefined, authorFieldValue, undefined);
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());
    await sut.validate(testNewDataset).catch((e) => fail(e));
  });

  test('should raise a date format validation error when a date field has an invalid format', async () => {
    const testNewDataset = createNewDatasetModel(undefined, undefined, undefined, '1-1-2020');
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'timePeriodCoveredStart',
      'There was an error when validating the field timePeriodCoveredStart from metadata block citation. Reason was: The field requires a valid date format (YYYY-MM-DD).',
    );
  });

  test('should not raise a date format validation error when a date field has a valid format', async () => {
    const testNewDataset = createNewDatasetModel(undefined, undefined, undefined, '2020-01-01');
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());
    await sut.validate(testNewDataset).catch((e) => fail(e));
  });

  test('should raise a controlled vocabulary error when a controlled vocabulary field has an invalid format', async () => {
    const testNewDataset = createNewDatasetModel(undefined, undefined, undefined, undefined, 'Wrong Value');
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'contributorType',
      'There was an error when validating the field contributorType from metadata block citation with parent field contributor. Reason was: The field does not have a valid controlled vocabulary value.',
      'contributor',
      0,
    );
  });

  test('should not raise a controlled vocabulary error when the value for a controlled vocabulary field is correct', async () => {
    const testNewDataset = createNewDatasetModel(undefined, undefined, undefined, undefined, 'Project Member');
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());
    await sut.validate(testNewDataset).catch((e) => fail(e));
  });
});
