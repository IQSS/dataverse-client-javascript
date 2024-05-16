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

describe('uploadFile', () => {
  const testCollectionAlias = 'directUploadTestCollection'
  let testDatasetIds: CreatedDatasetIdentifiers

  const sut: DirectUploadClient = new DirectUploadClient()

  const singlepartFilePath = path.join(__dirname, 'test-file')

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
  })

  afterAll(async () => {
    await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
    deleteFileInFileSystem(singlepartFilePath)
  })

  test('should upload file to destination when there is only one destination', async () => {
    await sut.uploadFile(
      singlepartFilePath,
      await createTestFileUploadDestinations(singlepartFilePath)
    )
  })

  const createTestFileUploadDestinations = async (filePath: string) => {
    const filesRepository = new FilesRepository()
    const destinations = await filesRepository.getFileUploadDestinations(
      testDatasetIds.numericId,
      filePath
    )
    destinations.forEach((destination) => {
      destination.url = destination.url.replace('localstack', 'localhost')
    })
    return destinations
  }
})
