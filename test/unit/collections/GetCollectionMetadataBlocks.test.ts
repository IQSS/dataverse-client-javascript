import { GetCollectionMetadataBlocks } from '../../../src/collections/domain/useCases/GetCollectionMetadataBlocks'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import { createMetadataBlockModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'

describe('execute', () => {
  test('should return collection metadata blocks on repository success', async () => {
    const testMetadataBlocks = [createMetadataBlockModel()]
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionMetadataBlocks = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks)
    const testGetCollectionMetadataBlocks = new GetCollectionMetadataBlocks(
      collectionsRepositoryStub
    )

    const actual = await testGetCollectionMetadataBlocks.execute(1)

    expect(actual).toEqual(testMetadataBlocks)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionMetadataBlocks = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetCollectionMetadataBlocks = new GetCollectionMetadataBlocks(
      collectionRepositoryStub
    )

    await expect(testGetCollectionMetadataBlocks.execute(1)).rejects.toThrow(ReadError)
  })
})
