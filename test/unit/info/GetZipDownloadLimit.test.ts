import { GetZipDownloadLimit } from '../../../src/info/domain/useCases/GetZipDownloadLimit';
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result on repository success', async () => {
    const testZipDownloadLimit = 100;
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    dataverseInfoRepositoryStub.getZipDownloadLimit = sandbox.stub().returns(testZipDownloadLimit);
    const sut = new GetZipDownloadLimit(dataverseInfoRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testZipDownloadLimit);
  });

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub = <IDataverseInfoRepository>{};
    const testReadError = new ReadError();
    dataverseInfoRepositoryStub.getZipDownloadLimit = sandbox.stub().throwsException(testReadError);
    const sut = new GetZipDownloadLimit(dataverseInfoRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
