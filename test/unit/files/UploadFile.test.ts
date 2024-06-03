import { createSinglepartFileBlob } from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { UploadFile } from '../../../src/files/domain/useCases/UploadFile'
import { IDirectUploadClient } from '../../../src/files/domain/clients/IDirectUploadClient'
import { createSingleFileUploadDestinationModel } from '../../testHelpers/files/fileUploadDestinationHelper'
import { ReadError } from '../../../src'
import { DirectUploadClientError } from '../../../src/files/domain/clients/DirectUploadClientError'

describe('execute', () => {
  let testFile: File
  const testFileDestination = createSingleFileUploadDestinationModel()

  beforeAll(async () => {
    testFile = await createSinglepartFileBlob()
  })

  test('should return undefined on client success', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    filesRepositoryStub.getFileUploadDestination = jest.fn().mockResolvedValue(testFileDestination)
    directUploadClientStub.uploadFile = jest.fn().mockResolvedValue(undefined)

    const sut = new UploadFile(filesRepositoryStub, directUploadClientStub)

    const actual = await sut.execute(1, testFile)

    expect(actual).toEqual(undefined)
  })

  test('should return error on respository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    filesRepositoryStub.getFileUploadDestination = jest.fn().mockRejectedValue(new ReadError())

    const sut = new UploadFile(filesRepositoryStub, directUploadClientStub)

    await expect(sut.execute(1, testFile)).rejects.toThrow(ReadError)
  })

  test('should return error on client error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    filesRepositoryStub.getFileUploadDestination = jest.fn().mockResolvedValue(testFileDestination)
    directUploadClientStub.uploadFile = jest
      .fn()
      .mockRejectedValue(new DirectUploadClientError('test'))

    const sut = new UploadFile(filesRepositoryStub, directUploadClientStub)

    await expect(sut.execute(1, testFile)).rejects.toThrow(DirectUploadClientError)
  })
})
