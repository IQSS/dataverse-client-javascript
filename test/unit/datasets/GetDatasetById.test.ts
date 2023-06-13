import { GetDatasetById } from '../../../src/datasets/domain/useCases/GetDatasetById';
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
    datasetsRepositoryStub.getDatasetById = getDatasetStub;
    const sut = new GetDatasetById(datasetsRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual, testDataset);
    assert.calledWithExactly(getDatasetStub, 1, undefined);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetById = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetById(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
