import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { UploadedFileDTO } from '../../../src/files'
import { ReplaceFile } from '../../../src/files/domain/useCases/ReplaceFile'
import { WriteError } from '../../../src/core'

describe('execute', () => {
  const testUploadedFileDTO: UploadedFileDTO = {
    fileName: 'testfile',
    storageId: 'testStorageId',
    checksumValue: 'testChecksumValue',
    checksumType: 'md5',
    mimeType: 'test/type'
  }

  test('should return file id on client success', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.replaceFile = jest.fn().mockResolvedValue(1)

    const sut = new ReplaceFile(filesRepositoryStub)

    const actual = await sut.execute(1, testUploadedFileDTO)

    expect(actual).toEqual(1)
  })

  test('should return error on client error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.replaceFile = jest.fn().mockRejectedValue(new WriteError('Some error'))

    const sut = new ReplaceFile(filesRepositoryStub)

    await expect(sut.execute(1, testUploadedFileDTO)).rejects.toThrow(WriteError)
  })
})
