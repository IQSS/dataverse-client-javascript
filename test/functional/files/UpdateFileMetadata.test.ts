import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  WriteError,
  updateFileMetadata,
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
import { UpdateFileMetadataDTO } from '../../../src/files/domain/dtos/UpdateFileMetadataDTO'
import { FileModel } from '../../../src/files/domain/models/FileModel'

describe('execute', () => {
  const testCollectionAlias = 'updateFileMetadatFunctionalTest'
  let testDatasetIds: CreatedDatasetIdentifiers
  const testTextFile1Name = 'test-file-1.txt'
  const metadataUpdate: UpdateFileMetadataDTO = {
    description: 'This is a test file',
    categories: ['file'],
    restrict: true
  }

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

  test('should successfully update metadata of a file', async () => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    const fileId = datasetFiles.files[0].id

    try {
      await updateFileMetadata.execute(fileId, metadataUpdate)
    } catch (error) {
      throw new Error('File metadata should be updated')
    } finally {
      const fileInfo: FileModel = (await getFile.execute(
        fileId,
        DatasetNotNumberedVersion.LATEST
      )) as FileModel

      expect(fileInfo.description).toEqual(metadataUpdate.description)
      expect(fileInfo.categories).toEqual(metadataUpdate.categories)
      expect(fileInfo.restricted).toEqual(metadataUpdate.restrict)
    }
  })

  test('should throw an error when the file id does not exist', async () => {
    let writeError: WriteError | undefined = undefined
    const nonExistentFileId = 5

    try {
      await updateFileMetadata.execute(nonExistentFileId, metadataUpdate)
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [400] Error attempting get the requested data file.`
      )
    }
  })
})
