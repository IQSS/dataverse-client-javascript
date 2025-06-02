import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { IsFileDeleted } from '../../../src/files/domain/useCases/IsFileDeleted'
import { ReadError } from '../../../src'

describe('execute', () => {
  test('should return true when file has been deleted', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.isFileDeleted = jest.fn().mockResolvedValue(true)
    const sut = new IsFileDeleted(filesRepositoryStub)

    const result = await sut.execute(1)

    expect(result).toBe(true)
  })

  test('should return false when file has not been deleted', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.isFileDeleted = jest.fn().mockResolvedValue(false)
    const sut = new IsFileDeleted(filesRepositoryStub)

    const result = await sut.execute(1)

    expect(result).toBe(false)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.isFileDeleted = jest.fn().mockRejectedValue(new ReadError())
    const sut = new IsFileDeleted(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
