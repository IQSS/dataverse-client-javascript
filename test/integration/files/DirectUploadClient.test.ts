import { ApiConfig, CreatedDatasetIdentifiers, createDataset } from '../../../src'
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
import path from 'path'
import { createFileInFileSystem, deleteFileInFileSystem } from '../../testHelpers/files/filesHelper'
import axios from 'axios'

describe('uploadFile', () => {
  const testCollectionAlias = 'directUploadTestCollection'
  let testDatasetIds: CreatedDatasetIdentifiers

  const sut: DirectUploadClient = new DirectUploadClient()

  const singlepartFileName = 'test-upload-file-single'
  const singlepartFilePath = path.join(__dirname, singlepartFileName)

  const multipartFileName = 'test-upload-file-multi'
  const multipartFilePath = path.join(__dirname, multipartFileName)

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)
    await setStorageDriverViaApi(testCollectionAlias, 'LocalStack')
    try {
      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }
    createFileInFileSystem(singlepartFilePath, 1000)
    createFileInFileSystem(multipartFilePath, 1273741824)
  })

  afterAll(async () => {
    await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
    deleteFileInFileSystem(singlepartFilePath)
    deleteFileInFileSystem(multipartFilePath)
  })

  test.skip('should upload file to destination when there is only one destination URL', async () => {
    const destination = await createTestFileUploadDestination(singlepartFilePath)
    const singlepartFileUrl = destination.urls[0]
    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(false)
    await sut.uploadFile(singlepartFilePath, destination)
    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(true)
  })

  test('should upload file to destinations when there are multiple destination URLs', async () => {
    const destination = await createTestFileUploadDestination(multipartFilePath)
    await sut.uploadFile(multipartFilePath, destination)
    //expect(await singlepartFileExistsInBucket(destination.urls[0])).toBe(true)
  })

  const createTestFileUploadDestination = async (filePath: string) => {
    const filesRepository = new FilesRepository()
    const destination = await filesRepository.getFileUploadDestination(
      testDatasetIds.numericId,
      filePath
    )
    destination.urls.forEach((destinationUrl, index) => {
      destination.urls[index] = destinationUrl.replace('localstack', 'localhost')
    })
    return destination
  }

  const singlepartFileExistsInBucket = async (fileUrl: string): Promise<boolean> => {
    return axios
      .get(`${fileUrl}`)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }
})
