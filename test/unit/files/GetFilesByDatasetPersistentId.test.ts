import { GetFilesByDatasetPersistentId } from '../../../src/files/domain/useCases/GetFilesByDatasetPersistentId';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { File } from '../../../src/files/domain/models/File';
import { createFileModel } from '../../testHelpers/files/filesHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return files on repository success', async () => {
    const testFiles: File[] = [createFileModel()];
    const filesRepositoryStub = <IFilesRepository>{};
    const getFilesByDatasetPersistentIdStub = sandbox.stub().returns(testFiles);
    filesRepositoryStub.getFilesByDatasetPersistentId = getFilesByDatasetPersistentIdStub;
    const sut = new GetFilesByDatasetPersistentId(filesRepositoryStub);

    const actual = await sut.execute('test');

    assert.match(actual, testFiles);
    assert.calledWithExactly(getFilesByDatasetPersistentIdStub, 'test', undefined, undefined, undefined, undefined);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFilesByDatasetPersistentId = sandbox.stub().throwsException(testReadError);
    const sut = new GetFilesByDatasetPersistentId(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute('test').catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
