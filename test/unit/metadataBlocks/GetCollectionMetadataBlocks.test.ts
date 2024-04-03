import { ReadError } from '../../../src'
import { createMetadataBlockModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { GetCollectionMetadataBlocks } from '../../../src/metadataBlocks/domain/useCases/GetCollectionMetadataBlocks'

describe('execute', () => {
  test('should return collection metadata blocks on repository success', async () => {
    const testMetadataBlocks = [createMetadataBlockModel()]
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {} as IMetadataBlocksRepository
    metadataBlocksRepositoryStub.getCollectionMetadataBlocks = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks)
    const testGetCollectionMetadataBlocks = new GetCollectionMetadataBlocks(
      metadataBlocksRepositoryStub
    )

    const actual = await testGetCollectionMetadataBlocks.execute(1)

    expect(actual).toEqual(testMetadataBlocks)
  })

  test('should return error result on repository error', async () => {
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {} as IMetadataBlocksRepository
    metadataBlocksRepositoryStub.getCollectionMetadataBlocks = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetCollectionMetadataBlocks = new GetCollectionMetadataBlocks(
      metadataBlocksRepositoryStub
    )

    await expect(testGetCollectionMetadataBlocks.execute(1)).rejects.toThrow(ReadError)
  })
})
