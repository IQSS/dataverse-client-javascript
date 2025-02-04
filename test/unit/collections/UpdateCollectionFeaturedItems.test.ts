import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import {
  createCollectionFeaturedItemsDTO,
  createCollectionFeaturedItemsModel
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import { UpdateCollectionFeaturedItems } from '../../../src/collections/domain/useCases/UpdateCollectionFeaturedItems'

const testFeaturedItemsDTO = createCollectionFeaturedItemsDTO()

describe('execute', () => {
  test('should update collection featured items on repository success', async () => {
    const testFeaturedItems = createCollectionFeaturedItemsModel()

    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.updateCollectionFeaturedItems = jest
      .fn()
      .mockResolvedValue(testFeaturedItems)
    const testGetCollectionFeaturedItems = new UpdateCollectionFeaturedItems(
      collectionRepositoryStub
    )

    const actual = await testGetCollectionFeaturedItems.execute(1, testFeaturedItemsDTO)

    expect(actual).toEqual(testFeaturedItems)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.updateCollectionFeaturedItems = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testUpdateCollectionFeaturedItems = new UpdateCollectionFeaturedItems(
      collectionRepositoryStub
    )

    await expect(
      testUpdateCollectionFeaturedItems.execute(1, testFeaturedItemsDTO)
    ).rejects.toThrow(ReadError)
  })
})
