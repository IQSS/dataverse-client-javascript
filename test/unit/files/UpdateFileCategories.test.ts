import { UpdateFileCategories } from '../../../src/files/domain/useCases/UpdateFileCategories'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('UpdateFileCategories', () => {
  const testFileCategories = ['category 1', 'category 2']
  test('should updated file tags with correct parameters and id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.updateFileCategories = jest.fn().mockResolvedValue(testFileCategories)

    const sut = new UpdateFileCategories(filesRepositoryStub)

    await sut.execute(1, testFileCategories)

    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledWith(
      1,
      testFileCategories,
      undefined
    )
    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledTimes(1)
  })

  test('should return the updated file tags with correct parameters and persisten Id', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileCategories: jest.fn().mockResolvedValue(testFileCategories)
    } as unknown as IFilesRepository

    const sut = new UpdateFileCategories(filesRepositoryStub)

    await sut.execute('doi:10.5072/FK2/HC6KTB', testFileCategories)

    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledWith(
      'doi:10.5072/FK2/HC6KTB',
      testFileCategories,
      undefined
    )
    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledTimes(1)
  })

  test('should call the repository with replace parameter', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileCategories: jest.fn().mockResolvedValue(testFileCategories)
    } as unknown as IFilesRepository

    const sut = new UpdateFileCategories(filesRepositoryStub)

    await sut.execute(1, testFileCategories, true)

    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledWith(
      1,
      testFileCategories,
      true
    )
  })

  test('should throw an error if the repository throws an error', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileCategories: jest.fn().mockRejectedValue(new WriteError())
    } as unknown as IFilesRepository

    const sut = new UpdateFileCategories(filesRepositoryStub)

    await expect(sut.execute(1, testFileCategories)).rejects.toThrow(WriteError)
    expect(filesRepositoryStub.updateFileCategories).toHaveBeenCalledWith(
      1,
      testFileCategories,
      undefined
    )
  })
})
