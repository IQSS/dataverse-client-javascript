import { GetDataset } from '../../../src/datasets/domain/useCases/GetDataset';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createDataset } from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset on repository success', async () => {
    const testDataset = createDataset();
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    datasetsRepositoryStub.getDataset = sandbox.stub().returns(testDataset);
    const sut = new GetDataset(datasetsRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testDataset);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDataset = sandbox.stub().throwsException(testReadError);
    const sut = new GetDataset(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
