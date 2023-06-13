import { GetDatasetByPersistentId } from '../../../src/datasets/domain/useCases/GetDatasetByPersistentId';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset on repository success', async () => {
    const testDataset = createDatasetModel();
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getDatasetStub = sandbox.stub().returns(testDataset);
    datasetsRepositoryStub.getDatasetByPersistentId = getDatasetStub;
    const sut = new GetDatasetByPersistentId(datasetsRepositoryStub);

    const actual = await sut.execute('1');

    assert.match(actual, testDataset);
    assert.calledWithExactly(getDatasetStub, '1', undefined);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetByPersistentId = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetByPersistentId(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute('1').catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
