import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetMyDataCollectionItems } from '../../../src/collections/domain/useCases/GetMyDataCollectionItems'
import { ReadError } from '../../../src'
import { CollectionItemType } from '../../../dist'
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper'
import { createFilePreviewModel } from '../../testHelpers/files/filePreviewHelper'
import { createCollectionPreviewModel } from '../../testHelpers/collections/collectionPreviewHelper'
import { MyDataCollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'

describe('GetCollectionItemsByUserRole', () => {
  let collectionRepositoryStub: ICollectionsRepository
  let testGetMyDataCollectionItems: GetMyDataCollectionItems

  const testRoleIds = [1, 2]
  const testCollectionItemTypes = [CollectionItemType.DATASET, CollectionItemType.FILE]
  const testLimit = 10
  const testPage = 1
  const testSearchText = 'test'
  const testItems = [
    createDatasetPreviewModel(),
    createFilePreviewModel(),
    createCollectionPreviewModel()
  ]

  const testItemSubset: MyDataCollectionItemSubset = {
    items: testItems,
    publishingFacet: testFacets,
    totalItemCount: testTotalCount,
    countPerObjectType: testCountPerObjectType
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
        testLimit,
        testPage,
        testSearchText
      )
    ).rejects.toThrow(ReadError)
  })

  test('should handle roleIds parameter', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetMyDataCollectionItems.execute(testRoleIds, [], undefined)

    expect(collectionRepositoryStub.getMyDataCollectionItems).toHaveBeenCalledWith(
      testRoleIds,
      [],
      undefined,
      undefined,
      undefined
    )
    expect(actual).toEqual(testItemSubset)
  })

  test('should handle collectionItemTypes parameter', async () => {
    collectionRepositoryStub.getMyDataCollectionItems = jest.fn().mockResolvedValue(testItemSubset)

    const actual = await testGetMyDataCollectionItems.execute([], testCollectionItemTypes)

    expect(collectionRepositoryStub.getMyDataCollectionItems).toHaveBeenCalledWith(
      [],
      testCollectionItemTypes,
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
      testLimit,
      testPage,
      testSearchText
    )

    expect(collectionRepositoryStub.getMyDataCollectionItems).toHaveBeenCalledWith(
      testRoleIds,
      testCollectionItemTypes,
      testLimit,
      testPage,
      testSearchText
    )
    expect(actual).toEqual(testItemSubset)
  })
})
