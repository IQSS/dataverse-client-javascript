import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { GetFileHasBeenDeleted } from '../../../src/files/domain/useCases/GetFileHasBeenDeleted'
import { ReadError } from '../../../src'

describe('execute', () => {
  test('should return true when file has been deleted', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileHasBeenDeleted = jest.fn().mockResolvedValue(true)
    const sut = new GetFileHasBeenDeleted(filesRepositoryStub)

    const result = await sut.execute(1)

    expect(result).toBe(true)
  })

  test('should return false when file has not been deleted', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileHasBeenDeleted = jest.fn().mockResolvedValue(false)
    const sut = new GetFileHasBeenDeleted(filesRepositoryStub)

    const result = await sut.execute(1)

    expect(result).toBe(false)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileHasBeenDeleted = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileHasBeenDeleted(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
