import { GetDatasetSummaryFieldNames } from '../../../src/datasets/domain/useCases/GetDatasetSummaryFieldNames';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result with field names on repository success', async () => {
    const testFieldNames = ['test1', 'test2'];
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    datasetsRepositoryStub.getDatasetSummaryFieldNames = sandbox.stub().returns(testFieldNames);
    const sut = new GetDatasetSummaryFieldNames(datasetsRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testFieldNames);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetSummaryFieldNames = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetSummaryFieldNames(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
