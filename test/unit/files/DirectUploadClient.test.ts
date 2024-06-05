import {
  createMultipartFileBlob,
  createSinglepartFileBlob
} from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ApiConfig, ReadError, WriteError } from '../../../src'
import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { UrlGenerationError } from '../../../src/files/infra/clients/errors/UrlGenerationError'
import {
  createMultipartFileUploadDestinationModel,
  createSingleFileUploadDestinationModel
} from '../../testHelpers/files/fileUploadDestinationHelper'
import axios from 'axios'
import { FileUploadError } from '../../../src/files/infra/clients/errors/FileUploadError'
import { AddUploadedFileToDatasetError } from '../../../src/files/infra/clients/errors/AddUploadedFileToDatasetError'
import { MultipartCompletionError } from '../../../src/files/infra/clients/errors/MultipartCompletionError'
import { FilePartUploadError } from '../../../src/files/infra/clients/errors/FilePartUploadError'
import { MultipartAbortError } from '../../../src/files/infra/clients/errors/MultipartAbortError'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

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

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(UrlGenerationError)
    })

    test('should return FileUploadError when there is an error on single file upload', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createSingleFileUploadDestinationModel())

      jest.spyOn(axios, 'put').mockRejectedValue('error')

      const sut = new DirectUploadClient(filesRepositoryStub)

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(FileUploadError)
    })

    test('should return AddUploadedFileToDatasetError when there is an error on adding the uploaded file to the dataset', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createSingleFileUploadDestinationModel())
      filesRepositoryStub.addUploadedFileToDataset = jest
        .fn()
        .mockRejectedValue(new WriteError('test'))

      jest.spyOn(axios, 'put').mockResolvedValue(undefined)

      const sut = new DirectUploadClient(filesRepositoryStub)

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(AddUploadedFileToDatasetError)
    })

    test('should return undefined on operation success', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createSingleFileUploadDestinationModel())
      filesRepositoryStub.addUploadedFileToDataset = jest.fn().mockResolvedValue(undefined)

      jest.spyOn(axios, 'put').mockResolvedValue(undefined)

      const sut = new DirectUploadClient(filesRepositoryStub)

      const actual = await sut.uploadFile(1, testFile)

      expect(actual).toEqual(undefined)
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

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(FilePartUploadError)
      expect(axios.delete).toHaveBeenCalledWith(
        `${ApiConfig.dataverseApiUrl}/datasets/mpupload/testAbort`,
        {
          headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': 'dummyApiKey' },
          params: {}
        }
      )
    })

    test('should return MultipartAbortError when there is an error on multipart file upload and abort endpoint call fails', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createMultipartFileUploadDestinationModel())

      jest.spyOn(axios, 'delete').mockRejectedValue('error')
      jest.spyOn(axios, 'put').mockRejectedValue('error')

      const sut = new DirectUploadClient(filesRepositoryStub, 1)

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(MultipartAbortError)
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

      const sut = new DirectUploadClient(filesRepositoryStub, 1)
      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(MultipartCompletionError)

      expect(axios.put).toHaveBeenCalledTimes(3)
    })

    test('should return AddUploadedFileToDatasetError when there is an error on adding the uploaded file to the dataset', async () => {
      const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
      filesRepositoryStub.getFileUploadDestination = jest
        .fn()
        .mockResolvedValue(createMultipartFileUploadDestinationModel())
      filesRepositoryStub.addUploadedFileToDataset = jest
        .fn()
        .mockRejectedValue(new WriteError('test'))

      jest.spyOn(axios, 'put').mockResolvedValue(successfulPartResponse)

      const sut = new DirectUploadClient(filesRepositoryStub, 1)

      await expect(sut.uploadFile(1, testFile)).rejects.toThrow(AddUploadedFileToDatasetError)
    })

    test('should return undefined on operation success', async () => {
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

      const actual = await sut.uploadFile(1, testFile)

      expect(actual).toEqual(undefined)
      expect(axios.put).toHaveBeenCalledWith(
        `${ApiConfig.dataverseApiUrl}/datasets/mpupload/testComplete`,
        { '1': 'test', '2': 'test' },
        {
          headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': 'dummyApiKey' },
          params: {}
        }
      )
    })
  })
})
