import { GetDatasetCitation } from '../../../src/datasets/domain/useCases/GetDatasetCitation';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testId = 1;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result with citation on repository success', async () => {
    const testCitation = 'test citation';
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getDatasetCitationStub = sandbox.stub().returns(testCitation);
    datasetsRepositoryStub.getDatasetCitation = getDatasetCitationStub;

    const sut = new GetDatasetCitation(datasetsRepositoryStub);

    const actual = await sut.execute(testId);

    assert.match(actual, testCitation);
    assert.calledWithExactly(getDatasetCitationStub, testId, false, undefined);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getDatasetCitation = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetCitation(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testId).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
