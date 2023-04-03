import { GetDataverseVersion } from '../../../src/info/domain/useCases/GetDataverseVersion';
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result with version on repository success', async () => {
    const testDataverseVersion = '5.13';
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    dataverseInfoRepositoryStub.getDataverseVersion = sandbox.stub().returns(testDataverseVersion);
    const sut = new GetDataverseVersion(dataverseInfoRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual.isSuccess, true);
    assert.match(actual.getValue(), testDataverseVersion);
  });

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    dataverseInfoRepositoryStub.getDataverseVersion = sandbox.stub().throwsException(new ReadError());
    const sut = new GetDataverseVersion(dataverseInfoRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual.isFailure, true);
  });
});
