import { GetFileUserPermissions } from '../../../src/files/domain/useCases/GetFileUserPermissions';
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { createFileUserPermissionsModel } from '../../testHelpers/files/fileUserPermissionsHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testFileId = 1;

  afterEach(() => {
    sandbox.restore();
  });

  test('should return file user permissions on repository success', async () => {
    const testFileUserPermissions = createFileUserPermissionsModel();
    const filesRepositoryStub = <IFilesRepository>{};
    const getFileUserPermissionsStub = sandbox.stub().returns(testFileUserPermissions);
    filesRepositoryStub.getFileUserPermissions = getFileUserPermissionsStub;
    const sut = new GetFileUserPermissions(filesRepositoryStub);

    const actual = await sut.execute(testFileId);

    assert.match(actual, testFileUserPermissions);
    assert.calledWithExactly(getFileUserPermissionsStub, testFileId);
  });

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{};
    const testReadError = new ReadError();
    filesRepositoryStub.getFileUserPermissions = sandbox.stub().throwsException(testReadError);
    const sut = new GetFileUserPermissions(filesRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testFileId).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
