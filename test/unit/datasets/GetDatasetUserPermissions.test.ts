import { GetDatasetUserPermissions } from '../../../src/datasets/domain/useCases/GetDatasetUserPermissions';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { createDatasetUserPermissionsModel } from '../../testHelpers/datasets/datasetUserPermissionsHelper';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testDatasetId = 1;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset user permissions on repository success', async () => {
    const testDatasetUserPermissions = createDatasetUserPermissionsModel();
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getDatasetUserPermissionsStub = sandbox.stub().returns(testDatasetUserPermissions);
    datasetsRepositoryStub.getDatasetUserPermissions = getDatasetUserPermissionsStub;
    const sut = new GetDatasetUserPermissions(datasetsRepositoryStub);

    const actual = await sut.execute(testDatasetId);

    assert.match(actual, testDatasetUserPermissions);
    assert.calledWithExactly(getDatasetUserPermissionsStub, testDatasetId);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetUserPermissions = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetUserPermissions(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testDatasetId).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
