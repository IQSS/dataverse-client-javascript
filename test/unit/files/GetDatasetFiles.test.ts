import { GetDatasetFiles } from '../../../src/files/domain/useCases/GetDatasetFiles';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { File } from '../../../src/files/domain/models/File';
import { createFileModel } from '../../testHelpers/files/filesHelper';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return files on repository success', async () => {
    const testFiles: File[] = [createFileModel()];
    const filesRepositoryStub = <IFilesRepository>{};
    const getDatasetFilesStub = sandbox.stub().returns(testFiles);
    filesRepositoryStub.getDatasetFiles = getDatasetFilesStub;
    const sut = new GetDatasetFiles(filesRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual, testFiles);
    assert.calledWithExactly(getDatasetFilesStub, 1, DatasetNotNumberedVersion.LATEST, false, FileOrderCriteria.NAME_AZ, undefined, undefined, undefined);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getDatasetFiles = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetFiles(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
