import { GetDatasetFileCounts } from '../../../src/files/domain/useCases/GetDatasetFileCounts';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { FileCounts } from '../../../src/files/domain/models/FileCounts';
import { createFileCountsModel } from '../../testHelpers/files/fileCountsHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return file counts on repository success', async () => {
    const testFileCounts: FileCounts = createFileCountsModel();
    const filesRepositoryStub = <IFilesRepository>{};
    const getDatasetFileCountsStub = sandbox.stub().returns(testFileCounts);
    filesRepositoryStub.getDatasetFileCounts = getDatasetFileCountsStub;
    const sut = new GetDatasetFileCounts(filesRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual, testFileCounts);
    assert.calledWithExactly(getDatasetFileCountsStub, 1, DatasetNotNumberedVersion.LATEST);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getDatasetFileCounts = sandbox.stub().throwsException(testReadError);
    const sut = new GetDatasetFileCounts(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
