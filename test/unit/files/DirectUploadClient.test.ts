import { createSinglepartFileBlob } from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError, WriteError } from '../../../src'
import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { UrlGenerationError } from '../../../src/files/infra/clients/errors/UrlGenerationError'
import { createSingleFileUploadDestinationModel } from '../../testHelpers/files/fileUploadDestinationHelper'
import axios from 'axios'
import { FileUploadError } from '../../../src/files/infra/clients/errors/FileUploadError'
import { AddUploadedFileToDatasetError } from '../../../src/files/infra/clients/errors/AddUploadedFileToDatasetError'

describe('uploadFile', () => {
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

  // TODO: Multipart unit tests
})
