import { createFileModel } from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { GetFile } from '../../../src/files/domain/useCases/GetFile'
import { DatasetNotNumberedVersion, ReadError } from '../../../src'

describe('execute', () => {
  test('should return file on repository success when passing numeric id', async () => {
    const testFile = createFileModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testFile)
    const sut = new GetFile(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testFile)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(1, DatasetNotNumberedVersion.LATEST)
  })

  test('should return file on repository success when passing string id', async () => {
    const testFile = createFileModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testFile)

    const sut = new GetFile(filesRepositoryStub)

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB')

    expect(actual).toEqual(testFile)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      'doi:10.5072/FK2/J8SJZB',
      DatasetNotNumberedVersion.LATEST
    )
  })

  test('should return file on repository success when passing string id and version id', async () => {
    const testFile = createFileModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testFile)

    const sut = new GetFile(filesRepositoryStub)

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB', '2.0')

    expect(actual).toEqual(testFile)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith('doi:10.5072/FK2/J8SJZB', '2.0')
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFile = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFile(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
