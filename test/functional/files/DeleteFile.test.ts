import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  deleteFile,
  getDatasetFileCounts,
  getDatasetFiles,
  WriteError
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testCollectionAlias = 'deleteFileFunctionalTest'
  let testDatasetIds: CreatedDatasetIdentifiers
  const testTextFile1Name = 'test-file-1.txt'

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)

    try {
      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }
    await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`)
    })
  })

  afterAll(async () => {
    try {
      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while deleting test dataset')
    }
    try {
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while deleting test collection')
    }
  })

  test('should successfully delete a file', async () => {
    try {
      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)

      await deleteFile.execute(datasetFiles.files[0].id)
    } catch (error) {
      throw new Error('File should be deleted')
    } finally {
      const datasetFileCounts = await getDatasetFileCounts.execute(testDatasetIds.numericId)

      expect(datasetFileCounts.total).toEqual(0)
    }
  })

  test('should throw an error when the file id does not exist', async () => {
    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    const nonExistentFileId = 5

    try {
      await deleteFile.execute(nonExistentFileId)
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [404] File with ID ${nonExistentFileId} not found.`
      )
    }
  })
})
