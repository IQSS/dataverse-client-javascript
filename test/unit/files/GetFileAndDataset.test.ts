import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createFileModel } from '../../testHelpers/files/filesHelper';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { DatasetNotNumberedVersion, ReadError } from '../../../src';
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper';
import { GetFileAndDataset } from '../../../src/files/domain/useCases/GetFileAndDataset';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  const testFile = createFileModel();
  const testDataset = createDatasetModel();
  const testTuple = [testFile, testDataset];

  afterEach(() => {
    sandbox.restore();
  });

  test('should return file and dataset on repository success when passing numeric id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileStub = sandbox.stub().returns(testTuple);
    filesRepositoryStub.getFile = getFileStub;
    const sut = new GetFileAndDataset(filesRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual[0], testFile);
    assert.match(actual[1], testDataset);
    assert.calledWithExactly(getFileStub, 1, DatasetNotNumberedVersion.LATEST, true);
  });

  test('should return file and dataset on repository success when passing string id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileStub = sandbox.stub().returns(testTuple);
    filesRepositoryStub.getFile = getFileStub;
    const sut = new GetFileAndDataset(filesRepositoryStub);

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB');

    assert.match(actual[0], testFile);
    assert.match(actual[1], testDataset);
    assert.calledWithExactly(getFileStub, 'doi:10.5072/FK2/J8SJZB', DatasetNotNumberedVersion.LATEST, true);
  });

  test('should return file and dataset on repository success when passing string id and version id', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileStub = sandbox.stub().returns(testTuple);
    filesRepositoryStub.getFile = getFileStub;
    const sut = new GetFileAndDataset(filesRepositoryStub);

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB', '2.0');

    assert.match(actual[0], testFile);
    assert.match(actual[1], testDataset);
    assert.calledWithExactly(getFileStub, 'doi:10.5072/FK2/J8SJZB', '2.0', true);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFile = sandbox.stub().throwsException(testReadError);
    const sut = new GetFileAndDataset(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
