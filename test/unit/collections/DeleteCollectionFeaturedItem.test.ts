import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { DeleteCollectionFeaturedItem } from '../../../src/collections/domain/useCases/DeleteCollectionFeaturedItem'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollectionFeaturedItem = jest.fn().mockResolvedValue(undefined)
    const testDeleteCollectionFeaturedItem = new DeleteCollectionFeaturedItem(
      collectionRepositoryStub
    )

    const actual = await testDeleteCollectionFeaturedItem.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollectionFeaturedItem = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const testDeleteCollectionFeaturedItem = new DeleteCollectionFeaturedItem(
      collectionRepositoryStub
    )

    await expect(testDeleteCollectionFeaturedItem.execute(1)).rejects.toThrow(WriteError)
  })
})
