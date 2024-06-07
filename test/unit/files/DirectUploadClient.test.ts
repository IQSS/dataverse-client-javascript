import {
  createMultipartFileBlob,
  createSinglepartFileBlob
} from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ApiConfig, ReadError } from '../../../src'
import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { UrlGenerationError } from '../../../src/files/infra/clients/errors/UrlGenerationError'
import {
  createMultipartFileUploadDestinationModel,
  createSingleFileUploadDestinationModel
} from '../../testHelpers/files/fileUploadDestinationHelper'
import axios from 'axios'
import { FileUploadError } from '../../../src/files/infra/clients/errors/FileUploadError'
import { MultipartCompletionError } from '../../../src/files/infra/clients/errors/MultipartCompletionError'
import { FilePartUploadError } from '../../../src/files/infra/clients/errors/FilePartUploadError'
import { MultipartAbortError } from '../../../src/files/infra/clients/errors/MultipartAbortError'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { FileUploadDestination } from '../../../src/files/domain/models/FileUploadDestination'

describe('uploadFile', () => {
  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
    jest.clearAllMocks()
  })

  describe('Single part file', () => {
    let testFile: File

    beforeAll(async () => {
      testFile = await createSinglepartFileBlob()
    })

    test('should return UrlGenerationError when repository raises error on URL generation', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockRejectedValue(new ReadError('test'))

      const sut = new DirectUploadClient(filesRepositoryStub)

      const progressMock = jest.fn()
      const abortController = new AbortController()

      await expect(sut.uploadFile(1, testFile, progressMock, abortController)).rejects.toThrow(
        UrlGenerationError
      )

      expect(progressMock).not.toHaveBeenCalled()
    })

    test('should return FileUploadError when there is an error on single file upload', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createSingleFileUploadDestinationModel())

      jest.spyOn(axios, 'put').mockRejectedValue('error')

      const sut = new DirectUploadClient(filesRepositoryStub)

      const progressMock = jest.fn()
      const abortController = new AbortController()

      await expect(sut.uploadFile(1, testFile, progressMock, abortController)).rejects.toThrow(
        FileUploadError
      )

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledTimes(1)
    })

    test('should storage identifier on operation success', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      const testDestination: FileUploadDestination = createSingleFileUploadDestinationModel()
      filesRepositoryStub.getFileUploadDestination = jest.fn().mockResolvedValue(testDestination)
      filesRepositoryStub.addUploadedFileToDataset = jest.fn().mockResolvedValue(undefined)

      jest.spyOn(axios, 'put').mockResolvedValue(undefined)

      const sut = new DirectUploadClient(filesRepositoryStub)

      const progressMock = jest.fn()
      const abortController = new AbortController()

      const actual = await sut.uploadFile(1, testFile, progressMock, abortController)

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledWith(100)
      expect(progressMock).toHaveBeenCalledTimes(2)

      expect(actual).toEqual(testDestination.storageId)
    })
  })

  describe('Multiple parts file', () => {
    let testFile: File

    const successfulPartResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: { etag: 'test' },
      config: {}
    }

    beforeAll(async () => {
      testFile = await createMultipartFileBlob()
    })

    test('should return FilePartUploadError when there is an error on multipart file upload and abort endpoint call works', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createMultipartFileUploadDestinationModel())

      jest.spyOn(axios, 'delete').mockResolvedValue(undefined)
      jest.spyOn(axios, 'put').mockRejectedValue('error')

      const sut = new DirectUploadClient(filesRepositoryStub, 1)

      const progressMock = jest.fn()
      const abortController = new AbortController()

      await expect(sut.uploadFile(1, testFile, progressMock, abortController)).rejects.toThrow(
        FilePartUploadError
      )

      expect(axios.delete).toHaveBeenCalledWith(
        `${ApiConfig.dataverseApiUrl}/datasets/mpupload/testAbort`,
        {
          headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': 'dummyApiKey' },
          params: {}
        }
      )

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledTimes(1)
    })

    test('should return MultipartAbortError when there is an error on multipart file upload and abort endpoint call fails', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createMultipartFileUploadDestinationModel())

      jest.spyOn(axios, 'delete').mockRejectedValue('error')
      jest.spyOn(axios, 'put').mockRejectedValue('error')

      const progressMock = jest.fn()
      const abortController = new AbortController()

      const sut = new DirectUploadClient(filesRepositoryStub, 1)

      await expect(sut.uploadFile(1, testFile, progressMock, abortController)).rejects.toThrow(
        MultipartAbortError
      )

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledTimes(1)
    })

    test('should return MultipartCompletionError when there is an error on multipart file completion', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createMultipartFileUploadDestinationModel())

      jest
        .spyOn(axios, 'put')
        .mockResolvedValueOnce(successfulPartResponse)
        .mockResolvedValueOnce(successfulPartResponse)
        .mockRejectedValueOnce(new Error('Third call failed'))

      const progressMock = jest.fn()
      const abortController = new AbortController()

      const sut = new DirectUploadClient(filesRepositoryStub, 1)
      await expect(sut.uploadFile(1, testFile, progressMock, abortController)).rejects.toThrow(
        MultipartCompletionError
      )

      expect(axios.put).toHaveBeenCalledTimes(3)

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledWith(50)
      expect(progressMock).toHaveBeenCalledWith(90)
      expect(progressMock).toHaveBeenCalledTimes(3)
    })

    test('should return storage identifier on operation success', async () => {
      const testMultipartDestination = createMultipartFileUploadDestinationModel()
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(testMultipartDestination)
      filesRepositoryStub.addUploadedFileToDataset = jest.fn().mockResolvedValue(undefined)

      jest
        .spyOn(axios, 'put')
        .mockResolvedValueOnce(successfulPartResponse)
        .mockResolvedValueOnce(successfulPartResponse)
        .mockResolvedValueOnce(undefined)

      const sut = new DirectUploadClient(filesRepositoryStub, 1)

      const progressMock = jest.fn()
      const abortController = new AbortController()

      const actual = await sut.uploadFile(1, testFile, progressMock, abortController)

      expect(actual).toEqual(testMultipartDestination.storageId)

      expect(progressMock).toHaveBeenCalledWith(10)
      expect(progressMock).toHaveBeenCalledWith(50)
      expect(progressMock).toHaveBeenCalledWith(90)
      expect(progressMock).toHaveBeenCalledWith(100)
      expect(progressMock).toHaveBeenCalledTimes(4)
    })
  })
})
