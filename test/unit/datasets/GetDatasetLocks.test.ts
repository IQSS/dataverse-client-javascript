import { GetDatasetLocks } from '../../../src/datasets/domain/useCases/GetDatasetLocks';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { createDatasetLockModel } from '../../testHelpers/datasets/datasetLockHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testDatasetId = 1;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset locks on repository success', async () => {
    const testDatasetLocks = [createDatasetLockModel()];
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getDatasetLocksStub = sandbox.stub().returns(testDatasetLocks);
    datasetsRepositoryStub.getDatasetLocks = getDatasetLocksStub;
    const sut = new GetDatasetLocks(datasetsRepositoryStub);

    const actual = await sut.execute(testDatasetId);

    assert.match(actual, testDatasetLocks);
    assert.calledWithExactly(getDatasetLocksStub, testDatasetId);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetLocks = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetLocks(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testDatasetId).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
