import { CreateDataset } from '../../../src/datasets/domain/useCases/CreateDataset';
import { CreatedDatasetIdentifiers } from '../../../src/datasets/domain/models/CreatedDatasetIdentifiers';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { NewResourceValidator } from '../../../src/core/domain/useCases/validators/NewResourceValidator';
import { createNewDatasetDTO, createNewDatasetMetadataBlockModel } from '../../testHelpers/datasets/newDatasetHelper';
import { ResourceValidationError } from '../../../src/core/domain/useCases/validators/errors/ResourceValidationError';
import { WriteError, ReadError } from '../../../src';
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testDataset = createNewDatasetDTO();
  const testMetadataBlocks = [createNewDatasetMetadataBlockModel()];

  afterEach(() => {
    sandbox.restore();
  });

  test('should return new dataset identifiers when validation is successful and repository call is successful', async () => {
    const testCreatedDatasetIdentifiers: CreatedDatasetIdentifiers = {
      persistentId: 'test',
      numericId: 1,
    };

    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const createDatasetStub = sandbox.stub().returns(testCreatedDatasetIdentifiers);
    datasetsRepositoryStub.createDataset = createDatasetStub;

    const newDatasetValidatorStub = <NewResourceValidator>{};
    const validateStub = sandbox.stub().resolves();
    newDatasetValidatorStub.validate = validateStub;

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlocks[0]);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;

    const sut = new CreateDataset(datasetsRepositoryStub, metadataBlocksRepositoryStub, newDatasetValidatorStub);

    const actual = await sut.execute(testDataset);

    assert.match(actual, testCreatedDatasetIdentifiers);

    assert.calledWithExactly(getMetadataBlockByNameStub, testMetadataBlocks[0].name);
    assert.calledWithExactly(validateStub, testDataset, testMetadataBlocks);
    assert.calledWithExactly(createDatasetStub, testDataset, testMetadataBlocks, 'root');

    assert.callOrder(validateStub, createDatasetStub);
  });

  test('should throw ResourceValidationError and not call repository when validation is unsuccessful', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{};
    const createDatasetMock = sandbox.stub();
    datasetsRepositoryMock.createDataset = createDatasetMock;

    const newDatasetValidatorStub = <NewResourceValidator>{};
    const testValidationError = new ResourceValidationError('Test error');
    const validateStub = sandbox.stub().throwsException(testValidationError);
    newDatasetValidatorStub.validate = validateStub;

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlocks[0]);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;

    const sut = new CreateDataset(datasetsRepositoryMock, metadataBlocksRepositoryStub, newDatasetValidatorStub);
    let actualError: ResourceValidationError = undefined;
    await sut.execute(testDataset).catch((e) => (actualError = e));
    assert.match(actualError, testValidationError);

    assert.calledWithExactly(getMetadataBlockByNameStub, testMetadataBlocks[0].name);
    assert.calledWithExactly(validateStub, testDataset, testMetadataBlocks);
    assert.notCalled(createDatasetMock);
  });

  test('should throw WriteError when validation is successful and repository raises an error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testWriteError = new WriteError('Test error');
    const createDatasetStub = sandbox.stub().throwsException(testWriteError);
    datasetsRepositoryStub.createDataset = createDatasetStub;

    const newDatasetValidatorStub = <NewResourceValidator>{};
    const validateMock = sandbox.stub().resolves();
    newDatasetValidatorStub.validate = validateMock;

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlocks[0]);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;

    const sut = new CreateDataset(datasetsRepositoryStub, metadataBlocksRepositoryStub, newDatasetValidatorStub);
    let actualError: WriteError = undefined;
    await sut.execute(testDataset).catch((e) => (actualError = e));
    assert.match(actualError, testWriteError);

    assert.calledWithExactly(getMetadataBlockByNameStub, testMetadataBlocks[0].name);
    assert.calledWithExactly(validateMock, testDataset, testMetadataBlocks);
    assert.calledWithExactly(createDatasetStub, testDataset, testMetadataBlocks, 'root');

    assert.callOrder(validateMock, createDatasetStub);
  });

  test('should throw ReadError when metadata blocks repository raises an error', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{};
    const createDatasetMock = sandbox.stub();
    datasetsRepositoryMock.createDataset = createDatasetMock;

    const newDatasetValidatorMock = <NewResourceValidator>{};
    const validateMock = sandbox.stub().resolves();
    newDatasetValidatorMock.validate = validateMock;

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const testReadError = new ReadError('Test error');
    const getMetadataBlockByNameStub = sandbox.stub().throwsException(testReadError);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;

    const sut = new CreateDataset(datasetsRepositoryMock, metadataBlocksRepositoryStub, newDatasetValidatorMock);
    let actualError: ReadError = undefined;
    await sut.execute(testDataset).catch((e) => (actualError = e));
    assert.match(actualError, testReadError);

    assert.notCalled(validateMock);
    assert.notCalled(createDatasetMock);

    assert.calledWithExactly(getMetadataBlockByNameStub, testMetadataBlocks[0].name);
  });
});
