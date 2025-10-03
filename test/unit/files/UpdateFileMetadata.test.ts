import { UpdateFileMetadata } from '../../../src/files/domain/useCases/UpdateFileMetadata'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'
import { createFileMetadataWithCategories } from '../../testHelpers/files/filesHelper'

describe('UpdateFileMetadata', () => {
  const testFileMetadata = createFileMetadataWithCategories()
  test('should updated file metadata with correct parameters and id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.updateFileMetadata = jest.fn().mockResolvedValue(testFileMetadata)

    const sut = new UpdateFileMetadata(filesRepositoryStub)

    await sut.execute(1, testFileMetadata)

    expect(filesRepositoryStub.updateFileMetadata).toHaveBeenCalledWith(
      1,
      testFileMetadata,
      undefined
    )
    expect(filesRepositoryStub.updateFileMetadata).toHaveBeenCalledTimes(1)
  })

  test('should return the updated file metadata with correct parameters and persisten Id', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileMetadata: jest.fn().mockResolvedValue(testFileMetadata)
    } as unknown as IFilesRepository

    const sut = new UpdateFileMetadata(filesRepositoryStub)

    await sut.execute('doi:10.5072/FK2/HC6KTB', testFileMetadata)

    expect(filesRepositoryStub.updateFileMetadata).toHaveBeenCalledWith(
      'doi:10.5072/FK2/HC6KTB',
      testFileMetadata,
      undefined
    )
    expect(filesRepositoryStub.updateFileMetadata).toHaveBeenCalledTimes(1)
  })

  test('should throw an error if the repository throws an error', async () => {
    const filesRepositoryStub: IFilesRepository = {
      updateFileMetadata: jest.fn().mockRejectedValue(new WriteError())
    } as unknown as IFilesRepository

    const sut = new UpdateFileMetadata(filesRepositoryStub)

    await expect(sut.execute(1, testFileMetadata)).rejects.toThrow(WriteError)
    expect(filesRepositoryStub.updateFileMetadata).toHaveBeenCalledWith(
      1,
      testFileMetadata,
      undefined
    )
  })
})
