import { IsEmbargoEnabled } from '../../../src/info/domain/useCases/IsEmbargoEnabled';
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result on repository success', async () => {
    const testResult = true;
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    dataverseInfoRepositoryStub.isEmbargoEnabled = sandbox.stub().returns(testResult);
    const sut = new IsEmbargoEnabled(dataverseInfoRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testResult);
  });

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    const testReadError = new ReadError();
    dataverseInfoRepositoryStub.isEmbargoEnabled = sandbox.stub().throwsException(testReadError);
    const sut = new IsEmbargoEnabled(dataverseInfoRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
