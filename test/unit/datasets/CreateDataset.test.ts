import { CreateDataset } from '../../../src/datasets/domain/useCases/CreateDataset';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { NewResourceValidator } from '../../../src/core/domain/useCases/validators/NewResourceValidator';
import { createNewDatasetModel } from '../../testHelpers/datasets/newDatasetHelper';
import { NewDataset } from '../../../src/datasets/domain/models/NewDataset';
import { ResourceValidationError } from '../../../src/core/domain/useCases/validators/errors/ResourceValidationError';
import { WriteError } from '../../../src';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testDataset = createNewDatasetModel();

  afterEach(() => {
    sandbox.restore();
  });

  test('should call repository when validation is successful', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const createDatasetStub = sandbox.stub();
    datasetsRepositoryStub.createDataset = createDatasetStub;

    const newDatasetValidatorMock = <NewResourceValidator<NewDataset>>{};
    const validateMock = sandbox.stub().resolves();
    newDatasetValidatorMock.validate = validateMock;

    const sut = new CreateDataset(datasetsRepositoryStub, newDatasetValidatorMock);

    await sut.execute(testDataset);

    assert.calledWithExactly(validateMock, testDataset);
    assert.calledWithExactly(createDatasetStub, testDataset);

    assert.callOrder(validateMock, createDatasetStub);
  });

  test('should throw ResourceValidationError and not call repository when validation is unsuccessful', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const createDatasetStub = sandbox.stub();
    datasetsRepositoryStub.createDataset = createDatasetStub;

    const newDatasetValidatorMock = <NewResourceValidator<NewDataset>>{};
    const testValidationError = new ResourceValidationError('Test error');
    const validateMock = sandbox.stub().throwsException(testValidationError);
    newDatasetValidatorMock.validate = validateMock;

    const sut = new CreateDataset(datasetsRepositoryStub, newDatasetValidatorMock);
    let actualError: ResourceValidationError = undefined;
    await sut.execute(testDataset).catch((e) => (actualError = e));
    assert.match(actualError, testValidationError);

    assert.calledWithExactly(validateMock, testDataset);
    assert.notCalled(createDatasetStub);
  });

  test('should throw WriteError when validation is successful and repository raises an error', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{};
    const testWriteError = new WriteError('Test error');
    const createDatasetMock = sandbox.stub().throwsException(testWriteError);
    datasetsRepositoryMock.createDataset = createDatasetMock;

    const newDatasetValidatorMock = <NewResourceValidator<NewDataset>>{};
    const validateMock = sandbox.stub().resolves();
    newDatasetValidatorMock.validate = validateMock;

    const sut = new CreateDataset(datasetsRepositoryMock, newDatasetValidatorMock);
    let actualError: ResourceValidationError = undefined;
    await sut.execute(testDataset).catch((e) => (actualError = e));
    assert.match(actualError, testWriteError);

    assert.calledWithExactly(validateMock, testDataset);
    assert.calledWithExactly(createDatasetMock, testDataset);

    assert.callOrder(validateMock, createDatasetMock);
  });
});
