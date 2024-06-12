import {
  ApiConfig,
  CreatedDatasetIdentifiers,
  DatasetNotNumberedVersion,
  FileOrderCriteria,
  createDataset
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createCollectionViaApi,
  deleteCollectionViaApi,
  setStorageDriverViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import axios from 'axios'
import {
  createMultipartFileBlob,
  createSinglepartFileBlob
} from '../../testHelpers/files/filesHelper'
import { FileUploadCancelError } from '../../../src/files/infra/clients/errors/FileUploadCancelError'

describe.skip('DirectUploadClient', () => {
  const testCollectionAlias = 'directUploadTestCollection'
  let testDataset1Ids: CreatedDatasetIdentifiers
  let testDataset2Ids: CreatedDatasetIdentifiers

  const filesRepository = new FilesRepository()
  const sut: DirectUploadClient = new DirectUploadClient(filesRepository)

  let singlepartFile: File
  let multipartFile: File

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)
    await setStorageDriverViaApi(testCollectionAlias, 'LocalStack')
    try {
      testDataset1Ids = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
      testDataset2Ids = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }
    singlepartFile = await createSinglepartFileBlob()
    multipartFile = await createMultipartFileBlob()
  })

  afterAll(async () => {
    await deleteUnpublishedDatasetViaApi(testDataset1Ids.numericId)
    await deleteUnpublishedDatasetViaApi(testDataset2Ids.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  test('should upload file and add it to the dataset when there is only one destination URL', async () => {
    const destination = await createTestFileUploadDestination(
      singlepartFile,
      testDataset1Ids.numericId
    )
    const singlepartFileUrl = destination.urls[0]

    const progressMock = jest.fn()
    const abortController = new AbortController()

    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(false)

    // Test uploadFile method

    const actualStorageId = await sut.uploadFile(
      testDataset1Ids.numericId,
      singlepartFile,
      progressMock,
      abortController,
      destination
    )
    expect(actualStorageId).toBe(destination.storageId)

    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(true)

    expect(progressMock).toHaveBeenCalledWith(10)
    expect(progressMock).toHaveBeenCalledWith(100)
    expect(progressMock).toHaveBeenCalledTimes(2)

    // Test addUploadedFileToDataset method

    let datasetFiles = await filesRepository.getDatasetFiles(
      testDataset1Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(0)

    await sut.addUploadedFileToDataset(testDataset1Ids.numericId, singlepartFile, actualStorageId)

    datasetFiles = await filesRepository.getDatasetFiles(
      testDataset1Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(1)
    expect(datasetFiles.files[0].name).toBe('singlepart-file')
    expect(datasetFiles.files[0].sizeBytes).toBe(singlepartFile.size)
    expect(datasetFiles.files[0].storageIdentifier).toContain('localstack1://mybucket:')
  })

  test('should upload file and add it to the dataset when there are multiple destination URLs', async () => {
    const destination = await createTestFileUploadDestination(
      multipartFile,
      testDataset2Ids.numericId
    )

    const progressMock = jest.fn()
    const abortController = new AbortController()

    // Test uploadFile method

    const actualStorageId = await sut.uploadFile(
      testDataset2Ids.numericId,
      multipartFile,
      progressMock,
      abortController,
      destination
    )
    expect(actualStorageId).toBe(destination.storageId)

    expect(progressMock).toHaveBeenCalledWith(10)
    expect(progressMock).toHaveBeenCalledWith(50)
    expect(progressMock).toHaveBeenCalledWith(90)
    expect(progressMock).toHaveBeenCalledWith(100)
    expect(progressMock).toHaveBeenCalledTimes(4)

    // Test addUploadedFileToDataset method

    let datasetFiles = await filesRepository.getDatasetFiles(
      testDataset2Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(0)

    await sut.addUploadedFileToDataset(testDataset2Ids.numericId, multipartFile, actualStorageId)

    datasetFiles = await filesRepository.getDatasetFiles(
      testDataset2Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(1)
    expect(datasetFiles.files[0].name).toBe('multipart-file')
    expect(datasetFiles.files[0].sizeBytes).toBe(multipartFile.size)
    expect(datasetFiles.files[0].storageIdentifier).toContain('localstack1://mybucket:')
  })

  test('should not finish uploading file to destinations when user cancels immediately and there are multiple destination urls', async () => {
    const destination = await createTestFileUploadDestination(
      multipartFile,
      testDataset2Ids.numericId
    )

    const progressMock = jest.fn()
    const abortController = new AbortController()

    setTimeout(() => {
      abortController.abort()
    }, 50)

    await expect(
      sut.uploadFile(
        testDataset2Ids.numericId,
        multipartFile,
        progressMock,
        abortController,
        destination
      )
    ).rejects.toThrow(FileUploadCancelError)

    expect(progressMock).not.toHaveBeenCalledWith(50)
    expect(progressMock).not.toHaveBeenCalledWith(90)
    expect(progressMock).not.toHaveBeenCalledWith(100)
  })

  const createTestFileUploadDestination = async (file: File, testDatasetId: number) => {
    const filesRepository = new FilesRepository()
    const destination = await filesRepository.getFileUploadDestination(testDatasetId, file)
    destination.urls.forEach((destinationUrl, index) => {
      destination.urls[index] = destinationUrl.replace('localstack', 'localhost')
    })
    return destination
  }

  const singlepartFileExistsInBucket = async (fileUrl: string): Promise<boolean> => {
    return axios
      .get(fileUrl)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }
})
