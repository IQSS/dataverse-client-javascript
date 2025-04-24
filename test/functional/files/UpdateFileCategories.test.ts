import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  WriteError,
  updateFileCategories,
  getFile,
  DatasetNotNumberedVersion,
  getDatasetFiles
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import { FileModel } from '../../../src/files/domain/models/FileModel'

describe('execute', () => {
  const testCollectionAlias = 'updateFileMetadataFunctionalTest-categories'
  let testDatasetIds: CreatedDatasetIdentifiers
  const testTextFile1Name = 'test-file-1.txt'
  const metadataUpdate = ['file']

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

  test('should successfully update categories of a file', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    try {
      await updateFileCategories.execute(fileId, metadataUpdate)
    } catch (error) {
      throw new Error('File metadata should be updated')
    } finally {
      const fileInfo: FileModel = (await getFile.execute(
        fileId,
        DatasetNotNumberedVersion.LATEST
      )) as FileModel

      expect(fileInfo.categories).toEqual(metadataUpdate)
    }
  })

  test('should successfully update categories of a file with replace parameter', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id
    const newCategories = ['new Category']
    try {
      await updateFileCategories.execute(fileId, newCategories, true)
    } catch (error) {
      throw new Error('File metadata should be updated')
    } finally {
      const fileInfo: FileModel = (await getFile.execute(
        fileId,
        DatasetNotNumberedVersion.LATEST
      )) as FileModel

      expect(fileInfo.categories).toEqual(newCategories)
    }
  })

  test('should not duplicate categories when merging', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    const initialCategories = ['Category 1', 'Category 2']
    const newCategories = ['Category 2', 'Category 3']
    const expectedMergedCategories = ['Category 1', 'Category 2', 'Category 3']

    await updateFileCategories.execute(fileId, initialCategories, true)
    await updateFileCategories.execute(fileId, newCategories, false)

    const fileInfo = (await getFile.execute(fileId, DatasetNotNumberedVersion.LATEST)) as FileModel

    expect(fileInfo.categories?.sort()).toEqual(expectedMergedCategories.sort())
  })

  test('should replace categories when replace = true', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    const initialCategories = ['Category 1', 'Category 2', 'Category 3']
    const newCategories = ['Category 4', 'Category 5', 'Category 6']

    await updateFileCategories.execute(fileId, initialCategories, true)
    await updateFileCategories.execute(fileId, newCategories, true)

    const fileInfo = (await getFile.execute(fileId, DatasetNotNumberedVersion.LATEST)) as FileModel

    expect(fileInfo.categories?.sort()).toEqual(newCategories.sort())
  })

  test('should throw an error when the file id does not exist', async () => {
    let writeError: WriteError | undefined = undefined
    const nonExistentFileId = 5

    try {
      await updateFileCategories.execute(nonExistentFileId, metadataUpdate)
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
