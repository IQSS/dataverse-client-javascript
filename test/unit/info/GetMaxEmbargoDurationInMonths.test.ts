import { GetMaxEmbargoDurationInMonths } from '../../../src/info/domain/useCases/GetMaxEmbargoDurationInMonths';
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return duration on repository success', async () => {
    const testDuration = 12;
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    dataverseInfoRepositoryStub.getMaxEmbargoDurationInMonths = sandbox.stub().returns(testDuration);
    const sut = new GetMaxEmbargoDurationInMonths(dataverseInfoRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testDuration);
  });

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    const testReadError = new ReadError();
    dataverseInfoRepositoryStub.getMaxEmbargoDurationInMonths = sandbox.stub().throwsException(testReadError);
    const sut = new GetMaxEmbargoDurationInMonths(dataverseInfoRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
