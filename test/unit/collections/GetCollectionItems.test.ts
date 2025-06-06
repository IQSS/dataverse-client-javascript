import { GetCollectionItems } from '../../../src/collections/domain/useCases/GetCollectionItems'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { CollectionSearchCriteria, ReadError } from '../../../src'
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper'
import { createFilePreviewModel } from '../../testHelpers/files/filePreviewHelper'
import { CollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'
import { createCollectionPreviewModel } from '../../testHelpers/collections/collectionPreviewHelper'
import { createCollectionItemsFacetsModel } from '../../testHelpers/collections/collectionItemsFacetsHelper'

describe('execute', () => {
  let collectionRepositoryStub: ICollectionsRepository
  let testGetCollectionItems: GetCollectionItems

  const testItems = [
    createDatasetPreviewModel(),
    createFilePreviewModel(),
    createCollectionPreviewModel()
  ]
  const testTotalCount = 3
  const testFacets = createCollectionItemsFacetsModel()

  const testItemSubset: CollectionItemSubset = {
    items: testItems,
    facets: testFacets,
    totalItemCount: testTotalCount
  }

  beforeEach(() => {
    collectionRepositoryStub = {} as ICollectionsRepository
    testGetCollectionItems = new GetCollectionItems(collectionRepositoryStub)
  })

  test('should return item subset on repository success', async () => {
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute()

    expect(actual).toEqual(testItemSubset)
  })

  test('should return error result on repository error', async () => {
    collectionRepositoryStub.getCollectionItems = jest.fn().mockRejectedValue(new ReadError())

    await expect(testGetCollectionItems.execute()).rejects.toThrow(ReadError)
  })

  test('should handle collectionId parameter', async () => {
    const collectionId = 'test-collection-id'
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute(collectionId)

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      collectionId,
      undefined,
      undefined,
      undefined,
      false,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle limit parameter', async () => {
    const limit = 10
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute(undefined, limit)

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      undefined,
      limit,
      undefined,
      undefined,
      false,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle offset parameter', async () => {
    const offset = 5
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute(undefined, undefined, offset)

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      undefined,
      undefined,
      offset,
      undefined,
      false,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle collectionSearchCriteria parameter', async () => {
    const searchCriteria: CollectionSearchCriteria = new CollectionSearchCriteria().withSearchText(
      'test'
    )
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute(
      undefined,
      undefined,
      undefined,
      searchCriteria,
      false
    )

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      searchCriteria,
      false,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle showTypeCounts parameter', async () => {
    const testItemSubsetWithCount = {
      ...testItemSubset,
      countPerObjectType: {
        collections: 1,
        datasets: 1,
        files: 1
      }
    }
    collectionRepositoryStub.getCollectionItems = jest
      .fn()
      .mockResolvedValue(testItemSubsetWithCount)

    const showTypeCounts = true

    const actual = await testGetCollectionItems.execute(
      undefined,
      undefined,
      undefined,
      undefined,
      showTypeCounts
    )

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      showTypeCounts,
      undefined
    )
    expect(actual).toEqual(testItemSubsetWithCount)
  })

  test('should handle all parameters', async () => {
    const collectionId = 'test-collection-id'
    const limit = 10
    const offset = 5
    const searchCriteria: CollectionSearchCriteria = new CollectionSearchCriteria().withSearchText(
      'test'
    )

    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetCollectionItems.execute(
      collectionId,
      limit,
      offset,
      searchCriteria,
      false,
      undefined
    )

    expect(collectionRepositoryStub.getCollectionItems).toHaveBeenCalledWith(
      collectionId,
      limit,
      offset,
      searchCriteria,
      false,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })
})
