import { GetFilesByDatasetId } from '../../../src/files/domain/useCases/GetFilesByDatasetId';
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
    const testFiles : File[] = [createFileModel()];
    const filesRepositoryStub = <IFilesRepository>{};
    const getFilesByDatasetIdStub = sandbox.stub().returns(testFiles);
    filesRepositoryStub.getFilesByDatasetId = getFilesByDatasetIdStub;
    const sut = new GetFilesByDatasetId(filesRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual, testFiles);
    assert.calledWithExactly(getFilesByDatasetIdStub, 1, undefined, undefined, undefined, undefined);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFilesByDatasetId = sandbox.stub().throwsException(testReadError);
    const sut = new GetFilesByDatasetId(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
