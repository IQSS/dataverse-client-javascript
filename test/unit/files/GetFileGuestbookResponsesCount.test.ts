import { GetFileGuestbookResponsesCount } from '../../../src/files/domain/useCases/GetFileGuestbookResponsesCount';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testFileId = 1;
  const testCount = 10;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return count on repository success filtering by id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileGuestbookResponsesCountStub = sandbox.stub().returns(testCount);
    filesRepositoryStub.getFileGuestbookResponsesCount = getFileGuestbookResponsesCountStub;
    const sut = new GetFileGuestbookResponsesCount(filesRepositoryStub);

    const actual = await sut.execute(testFileId);

    assert.match(actual, testCount);
    assert.calledWithExactly(getFileGuestbookResponsesCountStub, testFileId);
  });

  test('should return count on repository success filtering by persistent id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileGuestbookResponsesCountStub = sandbox.stub().returns(testCount);
    filesRepositoryStub.getFileGuestbookResponsesCount = getFileGuestbookResponsesCountStub;
    const sut = new GetFileGuestbookResponsesCount(filesRepositoryStub);

    const actual = await sut.execute(TestConstants.TEST_DUMMY_PERSISTENT_ID);

    assert.match(actual, testCount);
    assert.calledWithExactly(getFileGuestbookResponsesCountStub, TestConstants.TEST_DUMMY_PERSISTENT_ID);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFileGuestbookResponsesCount = sandbox.stub().throwsException(testReadError);
    const sut = new GetFileGuestbookResponsesCount(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testFileId).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
