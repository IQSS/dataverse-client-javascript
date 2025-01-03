import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import { createCollectionFeaturedItemsModel } from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import { GetCollectionFeaturedItems } from '../../../src/collections/domain/useCases/GetCollectionFeaturedItems'

describe('execute', () => {
  test('should return collection featured items on repository success', async () => {
    const testFeaturedItems = createCollectionFeaturedItemsModel()
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionFeaturedItems = jest
      .fn()
      .mockResolvedValue(testFeaturedItems)
    const testGetCollectionFeaturedItems = new GetCollectionFeaturedItems(collectionRepositoryStub)

    const actual = await testGetCollectionFeaturedItems.execute(1)

    expect(actual).toEqual(testFeaturedItems)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionFeaturedItems = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetCollectionFeaturedItems = new GetCollectionFeaturedItems(collectionRepositoryStub)

    await expect(testGetCollectionFeaturedItems.execute(1)).rejects.toThrow(ReadError)
  })
})
