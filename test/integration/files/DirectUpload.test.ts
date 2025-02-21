import {
  ApiConfig,
  CreatedDatasetIdentifiers,
  DatasetNotNumberedVersion,
  FileOrderCriteria,
  UploadedFileDTO,
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
import * as crypto from 'crypto'

describe('Direct Upload', () => {
  const testCollectionAlias = 'directUploadTestCollection'
  let testDataset1Ids: CreatedDatasetIdentifiers
  let testDataset2Ids: CreatedDatasetIdentifiers
  let testDataset3Ids: CreatedDatasetIdentifiers

  const filesRepositorySut = new FilesRepository()
  const directUploadSut: DirectUploadClient = new DirectUploadClient(filesRepositorySut)

  let singlepartFile: File
  let multipartFile: File

  const checksumAlgorithm = 'md5'

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
      testDataset3Ids = await createDataset.execute(
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
    await deleteUnpublishedDatasetViaApi(testDataset3Ids.numericId)
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

    // Test DirectUpload.uploadFile method

    const actualStorageId = await directUploadSut.uploadFile(
      testDataset1Ids.numericId,
      singlepartFile,
      progressMock,
      abortController,
      destination
    )
    expect(actualStorageId).toBe(destination.storageId)

    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(true)

    // Test FilesRepository.addUploadedFileToDataset method

    let datasetFiles = await filesRepositorySut.getDatasetFiles(
      testDataset1Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(0)

    const fileArrayBuffer = await singlepartFile.arrayBuffer()
    const fileBuffer = Buffer.from(fileArrayBuffer)

    const uploadedFileDTO = {
      fileName: singlepartFile.name,
      storageId: actualStorageId,
      checksumType: checksumAlgorithm,
      checksumValue: calculateBlobChecksum(fileBuffer),
      mimeType: singlepartFile.type
    }

    await filesRepositorySut.addUploadedFilesToDataset(testDataset1Ids.numericId, [uploadedFileDTO])

    datasetFiles = await filesRepositorySut.getDatasetFiles(
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

    // Test DirectUpload.uploadFile method

    const actualStorageId = await directUploadSut.uploadFile(
      testDataset2Ids.numericId,
      multipartFile,
      progressMock,
      abortController,
      destination
    )
    expect(actualStorageId).toBe(destination.storageId)

    // Test FilesRepository.addUploadedFileToDataset method

    let datasetFiles = await filesRepositorySut.getDatasetFiles(
      testDataset2Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(0)

    const fileArrayBuffer = await multipartFile.arrayBuffer()
    const fileBuffer = Buffer.from(fileArrayBuffer)

    const uploadedFileDTO = {
      fileName: multipartFile.name,
      storageId: actualStorageId,
      checksumType: checksumAlgorithm,
      checksumValue: calculateBlobChecksum(fileBuffer),
      mimeType: multipartFile.type
    }

    await filesRepositorySut.addUploadedFilesToDataset(testDataset2Ids.numericId, [uploadedFileDTO])

    datasetFiles = await filesRepositorySut.getDatasetFiles(
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
      directUploadSut.uploadFile(
        testDataset2Ids.numericId,
        multipartFile,
        progressMock,
        abortController,
        destination
      )
    ).rejects.toThrow(FileUploadCancelError)
  })

  test('should upload file add it to the dataset, upload a new one and replace it', async () => {
    // 1 - Upload first file and add it to the dataset
    const destination = await createTestFileUploadDestination(
      singlepartFile,
      testDataset3Ids.numericId
    )
    const singlepartFileUrl = destination.urls[0]

    const progressMock = jest.fn()
    const abortController = new AbortController()

    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(false)

    const actualStorageId = await directUploadSut.uploadFile(
      testDataset3Ids.numericId,
      singlepartFile,
      progressMock,
      abortController,
      destination
    )
    expect(actualStorageId).toBe(destination.storageId)

    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(true)

    let datasetFiles = await filesRepositorySut.getDatasetFiles(
      testDataset3Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(0)

    const fileArrayBuffer = await singlepartFile.arrayBuffer()
    const fileBuffer = Buffer.from(fileArrayBuffer)

    const uploadedFileDTO = {
      fileName: singlepartFile.name,
      storageId: actualStorageId,
      checksumType: checksumAlgorithm,
      checksumValue: calculateBlobChecksum(fileBuffer),
      mimeType: singlepartFile.type
    }

    await filesRepositorySut.addUploadedFilesToDataset(testDataset3Ids.numericId, [uploadedFileDTO])

    datasetFiles = await filesRepositorySut.getDatasetFiles(
      testDataset3Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(1)
    expect(datasetFiles.files[0].name).toBe('singlepart-file')
    expect(datasetFiles.files[0].sizeBytes).toBe(singlepartFile.size)
    expect(datasetFiles.files[0].storageIdentifier).toContain('localstack1://mybucket:')

    // 2 - Upload a new file and get the new storage id
    const newSinglepartFile = await createSinglepartFileBlob('new-singlepart-file', 1500)
    const newDestination = await createTestFileUploadDestination(
      newSinglepartFile,
      testDataset3Ids.numericId
    )
    const newSinglepartFileUrl = newDestination.urls[0]

    expect(await singlepartFileExistsInBucket(newSinglepartFileUrl)).toBe(false)

    const newFileStorageId = await directUploadSut.uploadFile(
      testDataset3Ids.numericId,
      newSinglepartFile,
      progressMock,
      abortController,
      newDestination
    )
    expect(newFileStorageId).toBe(newDestination.storageId)

    expect(await singlepartFileExistsInBucket(newSinglepartFileUrl)).toBe(true)

    // 3 - Replace the old file with the new file (must have different content)
    const currentFileId = datasetFiles.files[0].id
    const newFileArrayBuffer = await newSinglepartFile.arrayBuffer()
    const newFileBuffer = Buffer.from(newFileArrayBuffer)
    const newUploadedFileDTO: UploadedFileDTO = {
      fileName: newSinglepartFile.name,
      storageId: newFileStorageId,
      checksumType: checksumAlgorithm,
      checksumValue: calculateBlobChecksum(newFileBuffer),
      mimeType: newSinglepartFile.type
    }

    await filesRepositorySut.replaceFile(currentFileId, newUploadedFileDTO)

    // 4 - Verify that the new file is in the dataset and the old file is not
    datasetFiles = await filesRepositorySut.getDatasetFiles(
      testDataset3Ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      true,
      FileOrderCriteria.NAME_AZ
    )

    expect(datasetFiles.totalFilesCount).toBe(1)
    expect(datasetFiles.files[0].name).toBe('new-singlepart-file')
    expect(datasetFiles.files[0].sizeBytes).toBe(newSinglepartFile.size)
    expect(datasetFiles.files[0].storageIdentifier).toContain('localstack1://mybucket:')
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

  const calculateBlobChecksum = (blob: Buffer): string => {
    const hash = crypto.createHash(checksumAlgorithm)
    hash.update(blob)
    return hash.digest('hex')
  }
})
