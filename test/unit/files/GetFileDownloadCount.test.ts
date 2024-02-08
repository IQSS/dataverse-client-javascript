import { GetFileDownloadCount } from '../../../src/files/domain/useCases/GetFileDownloadCount'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testFileId = 1
  const testCount = 10

  test('should return count on repository success filtering by id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileDownloadCount = jest.fn().mockResolvedValue(testCount)
    const sut = new GetFileDownloadCount(filesRepositoryStub)

    const actual = await sut.execute(testFileId)

    expect(actual).toBe(testCount)
    expect(filesRepositoryStub.getFileDownloadCount).toHaveBeenCalledWith(testFileId)
  })

  test('should return count on repository success filtering by persistent id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileDownloadCount = jest.fn().mockResolvedValue(testCount)
    const sut = new GetFileDownloadCount(filesRepositoryStub)

    const actual = await sut.execute(TestConstants.TEST_DUMMY_PERSISTENT_ID)

    expect(actual).toBe(testCount)
    expect(filesRepositoryStub.getFileDownloadCount).toHaveBeenCalledWith(
      TestConstants.TEST_DUMMY_PERSISTENT_ID
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileDownloadCount = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileDownloadCount(filesRepositoryStub)

    await expect(sut.execute(testFileId)).rejects.toThrow(ReadError)
  })
})
