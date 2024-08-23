import { DirectUploadClientError } from '../../../src/files/domain/clients/DirectUploadClientError'
import { AddUploadedFilesToDataset } from '../../../src/files/domain/useCases/AddUploadedFilesToDataset'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'

describe('execute', () => {
  const testUploadedFileDTOs = [
    {
      fileName: 'testfile',
      storageId: 'testStorageId',
      checksumValue: 'testChecksumValue',
      checksumType: 'md5',
      mimeType: 'test/type'
    }
  ]

  test('should return undefined on client success', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.addUploadedFilesToDataset = jest.fn().mockResolvedValue(undefined)

    const sut = new AddUploadedFilesToDataset(filesRepositoryStub)

    const actual = await sut.execute(1, testUploadedFileDTOs)

    expect(actual).toEqual(undefined)
  })

  test('should return error on client error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.addUploadedFilesToDataset = jest
      .fn()
      .mockRejectedValue(new DirectUploadClientError('test', 'test', 'test'))

    const sut = new AddUploadedFilesToDataset(filesRepositoryStub)

    await expect(sut.execute(1, testUploadedFileDTOs)).rejects.toThrow(DirectUploadClientError)
  })
})
