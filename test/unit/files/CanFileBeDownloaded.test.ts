import { CanFileBeDownloaded } from '../../../src/files/domain/useCases/CanFileBeDownloaded';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testFileId = 1;
  const expectedResult = true;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return result on repository success filtering by id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const canFileBeDownloadedStub = sandbox.stub().returns(expectedResult);
    filesRepositoryStub.canFileBeDownloaded = canFileBeDownloadedStub;
    const sut = new CanFileBeDownloaded(filesRepositoryStub);

    const actual = await sut.execute(testFileId);

    assert.match(actual, expectedResult);
    assert.calledWithExactly(canFileBeDownloadedStub, testFileId);
  });

  test('should return result on repository success filtering by persistent id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const canFileBeDownloadedStub = sandbox.stub().returns(expectedResult);
    filesRepositoryStub.canFileBeDownloaded = canFileBeDownloadedStub;
    const sut = new CanFileBeDownloaded(filesRepositoryStub);

    const actual = await sut.execute(TestConstants.TEST_DUMMY_PERSISTENT_ID);

    assert.match(actual, expectedResult);
    assert.calledWithExactly(canFileBeDownloadedStub, TestConstants.TEST_DUMMY_PERSISTENT_ID);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.canFileBeDownloaded = sandbox.stub().throwsException(testReadError);
    const sut = new CanFileBeDownloaded(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testFileId).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
