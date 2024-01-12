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

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should not raise validation error when new dataset is valid', async () => {
    const testNewDataset = createNewDatasetModel();
    const testMetadataBlock = createNewDatasetMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    const sut = new NewDatasetValidator(metadataBlocksRepositoryStub);

    await sut.validate(testNewDataset).catch((e) => fail(e));
  });

  test('should raise an empty field error when a first level field is missing', async () => {
    const testNewDataset = createNewDatasetModelWithoutFirstLevelRequiredField();
    const testMetadataBlock = createNewDatasetMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    const sut = new NewDatasetValidator(metadataBlocksRepositoryStub);

    await sut
      .validate(testNewDataset)
      .then(() => {
        fail('Validation should fail');
      })
      .catch((error) => {
        const emptyFieldError = error as EmptyFieldError;
        assert.match(emptyFieldError.citationBlockName, 'citation');
        assert.match(emptyFieldError.metadataFieldName, 'author');
        assert.match(emptyFieldError.parentMetadataFieldName, undefined);
        assert.match(
          emptyFieldError.message,
          'There was an error when validating the field author from metadata block citation. Reason was: The field should not be empty.',
        );
      });
  });

  test('should raise an error when the provided field value for a multiple field is a string', async () => {
    const invalidAuthorFieldValue = 'invalidValue';
    const testNewDataset = createNewDatasetModel(invalidAuthorFieldValue);
    const testMetadataBlock = createNewDatasetMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    const sut = new NewDatasetValidator(metadataBlocksRepositoryStub);

    await sut
      .validate(testNewDataset)
      .then(() => {
        fail('Validation should fail');
      })
      .catch((error) => {
        const emptyFieldError = error as FieldValidationError;
        assert.match(emptyFieldError.citationBlockName, 'citation');
        assert.match(emptyFieldError.metadataFieldName, 'author');
        assert.match(emptyFieldError.parentMetadataFieldName, undefined);
        assert.match(
          emptyFieldError.message,
          'There was an error when validating the field author from metadata block citation. Reason was: Expecting an array of values.',
        );
      });
  });
});
