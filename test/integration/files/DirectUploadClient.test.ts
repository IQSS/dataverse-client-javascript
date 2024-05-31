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
import axios from 'axios'
import {
  createMultipartFileBlob,
  createSinglepartFileBlob
} from '../../testHelpers/files/filesHelper'

describe('uploadFile', () => {
  const testCollectionAlias = 'directUploadTestCollection'
  let testDatasetIds: CreatedDatasetIdentifiers

  const sut: DirectUploadClient = new DirectUploadClient()

  let singlepartFile: File
  let multipartFile: File

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
    singlepartFile = await createSinglepartFileBlob()
    multipartFile = await createMultipartFileBlob()
  })

  afterAll(async () => {
    await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  test('should upload file to destination when there is only one destination URL', async () => {
    const destination = await createTestFileUploadDestination(singlepartFile)
    const singlepartFileUrl = destination.urls[0]
    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(false)
    await sut.uploadFile(singlepartFile, destination)
    expect(await singlepartFileExistsInBucket(singlepartFileUrl)).toBe(true)
  })

  test('should upload file to destinations when there are multiple destination URLs', async () => {
    const destination = await createTestFileUploadDestination(multipartFile)
    const result = await sut.uploadFile(multipartFile, destination)
    expect(result).toBeUndefined()
  })

  const createTestFileUploadDestination = async (file: File) => {
    const filesRepository = new FilesRepository()
    const destination = await filesRepository.getFileUploadDestination(
      testDatasetIds.numericId,
      file
    )
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
