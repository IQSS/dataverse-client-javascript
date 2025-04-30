import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetMyDataCollectionItems } from '../../../src/collections/domain/useCases/GetMyDataCollectionItems'
import { ReadError } from '../../../src'
import { CollectionItemType } from '../../../src/collections/domain/models/CollectionItemType'
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper'
import { createFilePreviewModel } from '../../testHelpers/files/filePreviewHelper'
import { createCollectionPreviewModel } from '../../testHelpers/collections/collectionPreviewHelper'
import { CollectionItemsFacet } from '../../../src/collections/domain/models/CollectionItemSubset'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'
import { CollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'
describe('GetMyDataCollectionItems', () => {
  let collectionRepositoryStub: ICollectionsRepository
  let testGetMyDataCollectionItems: GetMyDataCollectionItems

  const testRoleIds = [1, 2]
  const testCollectionItemTypes = [CollectionItemType.DATASET, CollectionItemType.FILE]
  const testPublishingStatuses = [
    PublicationStatus.Published,
    PublicationStatus.Draft,
    PublicationStatus.Unpublished
  ]
  const testLimit = 10
  const testPage = 1
  const testSearchText = 'test'
  const testOtherUserName = 'testUser'
  const testItems = [
    createCollectionPreviewModel(),
    createDatasetPreviewModel(),
    createFilePreviewModel()
  ]
  const testFacets = [
    {
      name: 'publicationStatus',
      friendlyName: 'Publication Status',
      labels: [
        {
          name: 'Published',
          count: 10
        },
        {
          name: 'Draft',
          count: 5
        },
        {
          name: 'Unpublished',
          count: 15
        }
      ]
    }
  ] as CollectionItemsFacet[]
  const testItemSubset: CollectionItemSubset = {
    items: testItems,
    facets: testFacets,
    totalItemCount: 30,
    countPerObjectType: { collections: 10, datasets: 15, files: 5 }
  }
  beforeEach(() => {
    collectionRepositoryStub = {} as ICollectionsRepository
    testGetMyDataCollectionItems = new GetMyDataCollectionItems(collectionRepositoryStub)
  })

  test('should return item subset on repository success', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses,
      testLimit,
      testPage,
      testSearchText
    )

    expect(actual).toEqual(testItemSubset)
  })

  test('should return error result on repository error', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockRejectedValue(new ReadError())

    await expect(
      testGetMyDataCollectionItems.execute(
        testRoleIds,
        testCollectionItemTypes,
        testPublishingStatuses,
        testLimit,
        testPage,
        testSearchText
      )
    ).rejects.toThrow(ReadError)
  })

  test('should handle required parameters', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses
    )

    expect(collectionRepositoryStub.getMyDataCollectionItems).toHaveBeenCalledWith(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses,
      undefined,
      undefined,
      undefined,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle all parameters', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetMyDataCollectionItems.execute(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses,
      testLimit,
      testPage,
      testSearchText,
      testOtherUserName
    )

    expect(collectionRepositoryStub.getMyDataCollectionItems).toHaveBeenCalledWith(
      testRoleIds,
      testCollectionItemTypes,
      testPublishingStatuses,
      testLimit,
      testPage,
      testSearchText,
      testOtherUserName
    )
    expect(actual).toEqual(testItemSubset)
  })
})
