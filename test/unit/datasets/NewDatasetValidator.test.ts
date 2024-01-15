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
import { NewDataset } from '../../../src/datasets/domain/models/NewDataset';

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
    expectedErrorMessage: string,
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
        assert.match(fieldValidationError.metadataFieldName, 'author');
        assert.match(fieldValidationError.parentMetadataFieldName, undefined);
        assert.match(fieldValidationError.message, expectedErrorMessage);
      });
  }

  test('should not raise validation error when new dataset is valid', async () => {
    const testNewDataset = createNewDatasetModel();
    const sut = new NewDatasetValidator(setupMetadataBlocksRepositoryStub());

    await sut.validate(testNewDataset).catch((e) => fail(e));
  });

  test('should raise an empty field error when a first level field is missing', async () => {
    await runValidateExpectingFieldValidationError<EmptyFieldError>(
      createNewDatasetModelWithoutFirstLevelRequiredField(),
      'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
    );
  });

  test('should raise an error when the provided field value for a multiple field is a string', async () => {
    const invalidAuthorFieldValue = 'invalidValue';
    const testNewDataset = createNewDatasetModel(invalidAuthorFieldValue);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.',
    );
  });

  test('should raise an error when the provided field value is an array of strings and the field expects an array of objects', async () => {
    const invalidAuthorFieldValue = ['invalidValue1', 'invalidValue2'];
    const testNewDataset = createNewDatasetModel(invalidAuthorFieldValue);
    await runValidateExpectingFieldValidationError<FieldValidationError>(
      testNewDataset,
      'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of sub fields, not strings',
    );
  });
});
