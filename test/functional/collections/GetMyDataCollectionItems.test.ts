import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  CollectionPreview,
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
import { CollectionItemType } from '../../../src/collections/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'

const testRoleIds = [1, 2, 3, 4, 5, 6, 7, 8]
const testCollectionItemTypes = [
  CollectionItemType.COLLECTION,
  CollectionItemType.DATASET,
  CollectionItemType.FILE
]
const testPublishingStatuses = [
  PublicationStatus.Published,
  PublicationStatus.Draft,
  PublicationStatus.Unpublished
]

describe('execute', () => {
  const testCollectionAlias = 'collectionsRepositoryGetMyDataCollection'
  let testDatasetIds: CreatedDatasetIdentifiers
  const testTextFile1Name = 'test-file-2.txt'

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
  test('should return an empty item subset when repository returns no results', async () => {
    const actual = await getMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      [PublicationStatus.Deaccessioned],
      undefined,
      undefined,
      'no-results-for-get-my-data-collection-items'
    )

    expect(actual.items).toEqual([])
    expect(actual.totalItemCount).toBe(0)
    expect(actual.publicationStatusCounts).toEqual([
      {
        publicationStatus: 'Published',
        count: 0
      },
      {
        publicationStatus: 'Unpublished',
        count: 0
      },
      {
        publicationStatus: 'Draft',
        count: 0
      },
      {
        publicationStatus: 'In Review',
        count: 0
      },
      {
        publicationStatus: 'Deaccessioned',
        count: 0
      }
    ])
    expect(actual.countPerObjectType).toEqual({
      collections: 0,
      datasets: 0,
      files: 0
    })
  })

  test('should return items when valid roles,collection types, and publishingStatuses are provided', async () => {
    // Give enough time to Solr for indexing
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const actual = await getMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses,
      undefined,
      undefined,
      testCollectionAlias
    )

    const actualCollectionPreview = actual.items[0] as CollectionPreview
    expect(actualCollectionPreview.alias).toBe(testCollectionAlias)

    expect(actual.totalItemCount).toBe(1)
    expect(actual.publicationStatusCounts).toEqual([
      {
        publicationStatus: 'Published',
        count: 0
      },
      {
        publicationStatus: 'Unpublished',
        count: 1
      },
      {
        publicationStatus: 'Draft',
        count: 0
      },
      {
        publicationStatus: 'In Review',
        count: 0
      },
      {
        publicationStatus: 'Deaccessioned',
        count: 0
      }
    ])
    expect(actual.countPerObjectType).toEqual({
      collections: 1,
      datasets: 0,
      files: 0
    })
  })

  test('should return an empty item subset when no role is specified', async () => {
    const actual = await getMyDataCollectionItems.execute(
      [],
      [],
      [],
      undefined,
      undefined,
      undefined
    )

    expect(actual.items).toEqual([])
    expect(actual.totalItemCount).toBe(0)
    expect(actual.publicationStatusCounts).toEqual([
      {
        publicationStatus: 'Published',
        count: 0
      },
      {
        publicationStatus: 'Unpublished',
        count: 0
      },
      {
        publicationStatus: 'Draft',
        count: 0
      },
      {
        publicationStatus: 'In Review',
        count: 0
      },
      {
        publicationStatus: 'Deaccessioned',
        count: 0
      }
    ])
    expect(actual.countPerObjectType).toEqual({
      collections: 0,
      datasets: 0,
      files: 0
    })
  })

  test('should return an empty item subset when no publication status is specified', async () => {
    const actual = await getMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      [],
      undefined,
      undefined,
      undefined
    )

    expect(actual.items).toEqual([])
    expect(actual.totalItemCount).toBe(0)
    expect(actual.publicationStatusCounts).toEqual([
      {
        publicationStatus: 'Published',
        count: 0
      },
      {
        publicationStatus: 'Unpublished',
        count: 0
      },
      {
        publicationStatus: 'Draft',
        count: 0
      },
      {
        publicationStatus: 'In Review',
        count: 0
      },
      {
        publicationStatus: 'Deaccessioned',
        count: 0
      }
    ])
    expect(actual.countPerObjectType).toEqual({
      collections: 0,
      datasets: 0,
      files: 0
    })
  })

  test('should return an empty item subset when no collection type is specified', async () => {
    const actual = await getMyDataCollectionItems.execute(
      testRoleIds,
      [],
      testPublishingStatuses,
      undefined,
      undefined,
      undefined
    )

    expect(actual.items).toEqual([])
    expect(actual.totalItemCount).toBe(0)
    expect(actual.publicationStatusCounts).toEqual([
      {
        publicationStatus: 'Published',
        count: 0
      },
      {
        publicationStatus: 'Unpublished',
        count: 0
      },
      {
        publicationStatus: 'Draft',
        count: 0
      },
      {
        publicationStatus: 'In Review',
        count: 0
      },
      {
        publicationStatus: 'Deaccessioned',
        count: 0
      }
    ])
    expect(actual.countPerObjectType).toEqual({
      collections: 0,
      datasets: 0,
      files: 0
    })
  })
})
