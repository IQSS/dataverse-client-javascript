import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  restrictFile,
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
  const testCollectionAlias = 'restrictFileFunctionalTest'
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

  test('should successfully restrict a file', async () => {
    try {
      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)

      await restrictFile.execute(datasetFiles.files[0].id, { restrict: true })
    } catch (error) {
      throw new Error('File should be restricted')
    } finally {
      const datasetFilesAfterRestriction = await getDatasetFiles.execute(testDatasetIds.numericId)
      expect(datasetFilesAfterRestriction.files[0].restricted).toEqual(true)
      // Unrestrict the file for the next test
      await restrictFile.execute(datasetFilesAfterRestriction.files[0].id, { restrict: false })
    }
  })

  test('should succesfully unrestrict a file', async () => {
    try {
      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
      await restrictFile.execute(datasetFiles.files[0].id, { restrict: true })
    } catch (error) {
      throw new Error('File should be restricted')
    } finally {
      const datasetFilesAfterRestriction = await getDatasetFiles.execute(testDatasetIds.numericId)
      expect(datasetFilesAfterRestriction.files[0].restricted).toEqual(true)
    }

    try {
      const datasetFilesAfterRestriction = await getDatasetFiles.execute(testDatasetIds.numericId)
      await restrictFile.execute(datasetFilesAfterRestriction.files[0].id, { restrict: false })
    } catch (error) {
      throw new Error('File should be unrestricted')
    } finally {
      const datasetFilesAfterUnrestriction = await getDatasetFiles.execute(testDatasetIds.numericId)
      expect(datasetFilesAfterUnrestriction.files[0].restricted).toEqual(false)
    }
  })

  test('should throw an error when the file id does not exist', async () => {
    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    const nonExistentFileId = 5

    try {
      await restrictFile.execute(nonExistentFileId, { restrict: true })
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)

      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [400] Could not find datafile with id ${nonExistentFileId}`
      )
    }
  })

  test('should throw an error when the terms of use is empty while enableAccess is false', async () => {
    let caughtError: unknown
    try {
      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
      await restrictFile.execute(datasetFiles.files[0].id, {
        restrict: true,
        enableAccessRequest: false
      })
    } catch (error) {
      caughtError = error
    }

    expect(caughtError).toBeInstanceOf(WriteError)
    expect((caughtError as WriteError).message).toEqual(
      'There was an error when writing the resource. Reason was: [409] Terms of Use and Access are invalid. You must enable request access or add terms of access in datasets with restricted files.'
    )
  })
})
