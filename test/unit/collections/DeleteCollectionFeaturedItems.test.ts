import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { DeleteCollectionFeaturedItems } from '../../../src/collections/domain/useCases/DeleteCollectionFeaturedItems'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollectionFeaturedItems = jest.fn().mockResolvedValue(undefined)

    const testDeleteCollectionFeaturedItems = new DeleteCollectionFeaturedItems(
      collectionRepositoryStub
    )

    const actual = await testDeleteCollectionFeaturedItems.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollectionFeaturedItems = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const testDeleteCollectionFeaturedItems = new DeleteCollectionFeaturedItems(
      collectionRepositoryStub
    )

    await expect(testDeleteCollectionFeaturedItems.execute(1)).rejects.toThrow(WriteError)
  })
})
