import { GetPrivateUrlDataset } from '../../../src/datasets/domain/useCases/GetPrivateUrlDataset';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testToken = 'token';

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset on repository success', async () => {
    const testDataset = createDatasetModel();
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getDatasetStub = sandbox.stub().returns(testDataset);
    datasetsRepositoryStub.getPrivateUrlDataset = getDatasetStub;
    const sut = new GetPrivateUrlDataset(datasetsRepositoryStub);

    const actual = await sut.execute(testToken, null);

    assert.match(actual, testDataset);
    assert.calledWithExactly(getDatasetStub, testToken, null);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getPrivateUrlDataset = sandbox.stub().throwsException(testReadError);
    const sut = new GetPrivateUrlDataset(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testToken, null).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
