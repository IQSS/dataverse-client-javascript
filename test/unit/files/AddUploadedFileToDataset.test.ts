import { DirectUploadClientError } from '../../../src/files/domain/clients/DirectUploadClientError'
import { AddUploadedFileToDataset } from '../../../src/files/domain/useCases/AddUploadedFileToDataset'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'

describe('execute', () => {
  const testUploadedFileDTO = {
    fileName: 'testfile',
    storageId: 'testStorageId',
    checksumValue: 'testChecksumValue',
    checksumType: 'md5',
    mimeType: 'test/type'
  }

  test('should return undefined on client success', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.addUploadedFileToDataset = jest.fn().mockResolvedValue(undefined)

    const sut = new AddUploadedFileToDataset(filesRepositoryStub)

    const actual = await sut.execute(1, testUploadedFileDTO)

    expect(actual).toEqual(undefined)
  })

  test('should return error on client error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.addUploadedFileToDataset = jest
      .fn()
      .mockRejectedValue(new DirectUploadClientError('test', 'test', 'test'))

    const sut = new AddUploadedFileToDataset(filesRepositoryStub)

    await expect(sut.execute(1, testUploadedFileDTO)).rejects.toThrow(DirectUploadClientError)
  })
})
