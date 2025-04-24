import {
  ApiConfig,
  CreatedDatasetIdentifiers,
  DatasetPreview,
  FilePreview,
  ReadError,
  createDataset,
  getMyDataCollectionItems
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { CollectionItemType } from '../../../dist'
import { PublicationStatus } from '../../../dist/core/domain/models/PublicationStatus'

const testRoleIds = [1, 2, 3, 4, 5, 6, 7, 8]
const testCollectionItemTypes = [CollectionItemType.DATASET, CollectionItemType.FILE]
const testPublishingStatuses = [
  PublicationStatus.Published,
  PublicationStatus.Draft,
  PublicationStatus.Unpublished
]

describe('execute', () => {
  beforeAll(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })
  test('should return ? when repository returns empty item subset', async () => {
    expect.assertions(2)
    let readError: ReadError | undefined = undefined
    try {
      await getMyDataCollectionItems.execute(
        testRoleIds,
        testCollectionItemTypes,
        testPublishingStatuses,
        undefined,
        undefined,
        undefined
      )
      throw new Error('Use case should throw an error')
    } catch (error) {
      readError = error as ReadError
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect(readError?.message).toEqual(
        'There was an error when reading the resource. Reason was: Sorry, no results were found.'
      )
    }
  }),
    describe('test with created collection items', () => {
      const testCollectionAlias = 'collectionsRepositoryFunctionalTestCollection'
      let testDatasetIds: CreatedDatasetIdentifiers
      const testTextFile1Name = 'test-file-1.txt'

      beforeAll(async () => {
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

      test('should return items when valid roles,collection types, and publishingStatuses are provided', async () => {
        // Give enough time to Solr for indexing
        await new Promise((resolve) => setTimeout(resolve, 5000))

        try {
          const actual = await getMyDataCollectionItems.execute(
            testRoleIds,
            testCollectionItemTypes,
            testPublishingStatuses
          )

          const actualFilePreview = actual.items[1] as FilePreview
          const actualDatasetPreview = actual.items[0] as DatasetPreview

          expect(actualFilePreview.name).toBe('test-file-1.txt')
          expect(actualDatasetPreview.title).toBe(
            'Dataset created using the createDataset use case'
          )

          expect(actual.totalItemCount).toBe(2)
        } catch (error) {
          throw new Error('Item subset should be retrieved')
        }
      })

      test('should return an error message when no role is specified', async () => {
        expect.assertions(2)
        let readError: ReadError | undefined = undefined
        try {
          await getMyDataCollectionItems.execute([], [], [], undefined, undefined, undefined)
          throw new Error('Use case should throw an error')
        } catch (error) {
          readError = error as ReadError
        } finally {
          expect(readError).toBeInstanceOf(ReadError)
          expect(readError?.message).toEqual(
            `There was an error when reading the resource. Reason was: No results. Please select at least one Role.`
          )
        }
      })
      test('should return an error message when no publication status is specified', async () => {
        expect.assertions(2)
        let readError: ReadError | undefined = undefined
        try {
          await getMyDataCollectionItems.execute(
            testRoleIds,
            testCollectionItemTypes,
            [],
            undefined,
            undefined,
            undefined
          )
          throw new Error('Use case should throw an error')
        } catch (error) {
          readError = error as ReadError
        } finally {
          expect(readError).toBeInstanceOf(ReadError)
          expect(readError?.message).toEqual(
            `There was an error when reading the resource. Reason was: No user found for: "Published, Unpublished, Draft, In Review, Deaccessioned"`
          )
        }
      })
      test('should an error message when no collection type is specified', async () => {
        expect.assertions(2)
        let readError: ReadError | undefined = undefined
        try {
          await getMyDataCollectionItems.execute(
            testRoleIds,
            testCollectionItemTypes,
            [],
            undefined,
            undefined,
            undefined
          )
          throw new Error('Use case should throw an error')
        } catch (error) {
          readError = error as ReadError
        } finally {
          expect(readError).toBeInstanceOf(ReadError)
          expect(readError?.message).toEqual(
            `There was an error when reading the resource. Reason was: No user found for: "Published, Unpublished, Draft, In Review, Deaccessioned"`
          )
        }
      })
    })
})
