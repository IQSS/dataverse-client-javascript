import { UpdateFileTabularTags } from '../../../src/files/domain/useCases/UpdateFileTabularTags'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('UpdateFileTabularTags', () => {
  const testFileTabularTags = ['Survey', 'Event']
  test('should updated file tags with correct parameters and id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.updateFileTabularTags = jest.fn().mockResolvedValue(testFileTabularTags)

    const sut = new UpdateFileTabularTags(filesRepositoryStub)

    await sut.execute(1, testFileTabularTags)

    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledWith(
      1,
      testFileTabularTags,
      undefined
    )
    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledTimes(1)
  })

  test('should return the updated file tags with correct parameters and persisten Id', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileTabularTags: jest.fn().mockResolvedValue(testFileTabularTags)
    } as unknown as IFilesRepository

    const sut = new UpdateFileTabularTags(filesRepositoryStub)

    await sut.execute('doi:10.5072/FK2/HC6KTB', testFileTabularTags)

    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledWith(
      'doi:10.5072/FK2/HC6KTB',
      testFileTabularTags,
      undefined
    )
    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledTimes(1)
  })

  test('should call the repository with replace parameter', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileTabularTags: jest.fn().mockResolvedValue(testFileTabularTags)
    } as unknown as IFilesRepository

    const sut = new UpdateFileTabularTags(filesRepositoryStub)

    await sut.execute(1, testFileTabularTags, true)

    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledWith(
      1,
      testFileTabularTags,
      true
    )
  })

  test('should throw an error if the repository throws an error', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileTabularTags: jest.fn().mockRejectedValue(new WriteError())
    } as unknown as IFilesRepository

    const sut = new UpdateFileTabularTags(filesRepositoryStub)

    await expect(sut.execute(1, testFileTabularTags)).rejects.toThrow(WriteError)
    expect(filesRepositoryStub.updateFileTabularTags).toHaveBeenCalledWith(
      1,
      testFileTabularTags,
      undefined
    )
  })
})
