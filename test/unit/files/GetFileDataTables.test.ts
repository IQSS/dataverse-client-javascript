import { GetFileDataTables } from '../../../src/files/domain/useCases/GetFileDataTables'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { FileDataTable } from '../../../src/files/domain/models/FileDataTable'
import { createFileDataTableModel } from '../../testHelpers/files/fileDataTablesHelper'

describe('execute', () => {
  const testFileId = 1

  test('should return file data tables on repository success', async () => {
    const testDataTables: FileDataTable[] = [createFileDataTableModel()]
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileDataTables = jest.fn().mockResolvedValue(testDataTables)
    const sut = new GetFileDataTables(filesRepositoryStub)

    const actual = await sut.execute(testFileId)

    expect(actual).toBe(testDataTables)
    expect(filesRepositoryStub.getFileDataTables).toHaveBeenCalledWith(testFileId)
  })

  test('should return error result on repository error', async () => {
    const testReadError = new ReadError()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileDataTables = jest.fn().mockRejectedValue(testReadError)
    const sut = new GetFileDataTables(filesRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute(testFileId).catch((e: ReadError) => (actualError = e))

    expect(actualError).toBe(testReadError)
  })
})
