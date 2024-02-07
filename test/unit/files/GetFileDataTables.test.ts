import { GetFileDataTables } from '../../../src/files/domain/useCases/GetFileDataTables'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { assert, createSandbox, SinonSandbox } from 'sinon'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { FileDataTable } from '../../../src/files/domain/models/FileDataTable'
import { createFileDataTableModel } from '../../testHelpers/files/fileDataTablesHelper'

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testFileId = 1

  afterEach(() => {
    sandbox.restore()
  })

  test('should return file data tables on repository success', async () => {
    const testDataTables: FileDataTable[] = [createFileDataTableModel()]
    const filesRepositoryStub = <IFilesRepository>{}
    const getFileDataTablesStub = sandbox.stub().returns(testDataTables)
    filesRepositoryStub.getFileDataTables = getFileDataTablesStub
    const sut = new GetFileDataTables(filesRepositoryStub)

    const actual = await sut.execute(testFileId)

    assert.match(actual, testDataTables)
    assert.calledWithExactly(getFileDataTablesStub, testFileId)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    const testReadError = new ReadError()
    filesRepositoryStub.getFileDataTables = sandbox.stub().throwsException(testReadError)
    const sut = new GetFileDataTables(filesRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute(testFileId).catch((e: ReadError) => (actualError = e))

    assert.match(actualError, testReadError)
  })
})
