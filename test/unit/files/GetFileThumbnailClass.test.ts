import { GetFileThumbnailClass } from '../../../src/files/domain/useCases/GetFileThumbnailClass';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { TestConstants } from '../../testHelpers/TestConstants';
import { FileThumbnailClass } from '../../../src/files/domain/models/FileThumbnailClass';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testFileId = 1;
  const testThumbnailClass = FileThumbnailClass.IMAGE;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return thumbnail class on repository success filtering by id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileThumbnailClassStub = sandbox.stub().returns(testThumbnailClass);
    filesRepositoryStub.getFileThumbnailClass = getFileThumbnailClassStub;
    const sut = new GetFileThumbnailClass(filesRepositoryStub);

    const actual = await sut.execute(testFileId);

    assert.match(actual, testThumbnailClass);
    assert.calledWithExactly(getFileThumbnailClassStub, testFileId);
  });

  test('should return thumbnail class on repository success filtering by persistent id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileThumbnailClassStub = sandbox.stub().returns(testThumbnailClass);
    filesRepositoryStub.getFileThumbnailClass = getFileThumbnailClassStub;
    const sut = new GetFileThumbnailClass(filesRepositoryStub);

    const actual = await sut.execute(TestConstants.TEST_DUMMY_PERSISTENT_ID);

    assert.match(actual, testThumbnailClass);
    assert.calledWithExactly(getFileThumbnailClassStub, TestConstants.TEST_DUMMY_PERSISTENT_ID);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFileThumbnailClass = sandbox.stub().throwsException(testReadError);
    const sut = new GetFileThumbnailClass(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testFileId).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
