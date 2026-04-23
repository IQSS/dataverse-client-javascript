import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  WriteError,
  updateFileTabularTags,
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
  const testCollectionAlias = 'updateFileMetadataFunctionalTest'
  let testDatasetIds: CreatedDatasetIdentifiers
  const testTextFile4Name = 'test-file-4.tsv'
  const tabularTags = ['Event']

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
    await uploadFileViaApi(testDatasetIds.numericId, testTextFile4Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile4Name}`)
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

  test('should successfully update tabular tags of a file', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    //wait for the tabular file to be ingested
    await new Promise((res) => setTimeout(res, 1000))
    try {
      await updateFileTabularTags.execute(fileId, tabularTags, false)
    } catch (error) {
      throw new Error('File tabularTags should be updated')
    } finally {
      const fileInfo: FileModel = (await getFile.execute(
        fileId,
        DatasetNotNumberedVersion.LATEST
      )) as FileModel

      expect(fileInfo.tabularTags).toEqual(tabularTags)
    }
  })

  test('should successfully update tabular tags of a file with replace parameter', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id
    const newTabularTags = ['Survey']
    try {
      await updateFileTabularTags.execute(fileId, newTabularTags, true)
    } catch (error) {
      throw new Error('File tabularTags should be updated')
    } finally {
      const fileInfo: FileModel = (await getFile.execute(
        fileId,
        DatasetNotNumberedVersion.LATEST
      )) as FileModel

      expect(fileInfo.tabularTags).toEqual(newTabularTags)
    }
  })

  test('should not duplicate tabular tags when merging', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    const initialTags = ['Survey', 'Panel']
    const newTags = ['Panel', 'Event']
    const expectedMergedTags = ['Survey', 'Panel', 'Event']

    await updateFileTabularTags.execute(fileId, initialTags, true)
    await updateFileTabularTags.execute(fileId, newTags, false)

    const fileInfo = (await getFile.execute(fileId, DatasetNotNumberedVersion.LATEST)) as FileModel

    expect(fileInfo.tabularTags?.sort()).toEqual(expectedMergedTags.sort())
  })

  test('should replace tabular tags when replace = true', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    const initialTags = ['Survey', 'Panel', 'Event']
    const newTags = ['Survey', 'Network']

    await updateFileTabularTags.execute(fileId, initialTags, true)
    await updateFileTabularTags.execute(fileId, newTags, true)

    const fileInfo = (await getFile.execute(fileId, DatasetNotNumberedVersion.LATEST)) as FileModel

    expect(fileInfo.tabularTags?.sort()).toEqual(newTags.sort())
  })

  test('should throw an error when updating tabular tags on a non-tabular file', async () => {
    const nonTabularFileName = 'test-file-1.txt'

    try {
      await uploadFileViaApi(testDatasetIds.numericId, nonTabularFileName)
    } catch {
      throw new Error(`Error uploading non-tabular file: ${nonTabularFileName}`)
    }
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const matchingFile = datasetFiles.files.find((f) => f.name === nonTabularFileName)
    if (!matchingFile) {
      throw new Error('Uploaded non-tabular file not found in dataset')
    }

    const fileId = matchingFile.id

    let writeError: WriteError | undefined = undefined

    try {
      await updateFileTabularTags.execute(fileId, ['Survey'], false)
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [400] This operation is only available for tabular files.`
      )
    }
  })

  test('should throw an error when the file id does not exist', async () => {
    let writeError: WriteError | undefined = undefined
    const nonExistentFileId = 5

    try {
      await updateFileTabularTags.execute(nonExistentFileId, tabularTags)
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
