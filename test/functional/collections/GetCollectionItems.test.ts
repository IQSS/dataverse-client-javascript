import {
  ApiConfig,
  CreatedDatasetIdentifiers,
  DatasetPreview,
  FilePreview,
  ReadError,
  createDataset,
  getCollectionItems
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { CollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'

describe('execute', () => {
  const testCollectionAlias = 'collectionsRepositoryFunctionalTestCollection'
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

  test('should return items when a valid collection alias is provided', async () => {
    // Give enough time to Solr for indexing
    await new Promise((resolve) => setTimeout(resolve, 5000))

    let actual: CollectionItemSubset
    try {
      actual = await getCollectionItems.execute(testCollectionAlias)
    } catch (error) {
      throw new Error('Item subset should be retrieved')
    } finally {
      const actualFilePreview = actual.items[0] as FilePreview
      const actualDatasetPreview = actual.items[1] as DatasetPreview

      expect(actualFilePreview.name).toBe('test-file-1.txt')
      expect(actualDatasetPreview.title).toBe('Dataset created using the createDataset use case')

      expect(actual.totalItemCount).toBe(2)
    }
  })

  test('should throw an error when collection does not exist', async () => {
    expect.assertions(2)
    let readError: ReadError
    try {
      await getCollectionItems.execute(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)
      throw new Error('Use case should throw an error')
    } catch (error) {
      readError = error
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect(readError.message).toEqual(
        `There was an error when reading the resource. Reason was: [400] Could not find dataverse with alias ${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}`
      )
    }
  })
})
