import { ReadError } from '../../../src'
import { createMetadataBlockModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { GetAllMetadataBlocks } from '../../../src/metadataBlocks/domain/useCases/GetAllMetadataBlocks'

describe('execute', () => {
  test('should return metadata blocks on repository success', async () => {
    const testMetadataBlocks = [createMetadataBlockModel()]
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {} as IMetadataBlocksRepository
    metadataBlocksRepositoryStub.getAllMetadataBlocks = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks)
    const testGetAllMetadataBlocks = new GetAllMetadataBlocks(metadataBlocksRepositoryStub)

    const actual = await testGetAllMetadataBlocks.execute()

    expect(actual).toEqual(testMetadataBlocks)
  })

  test('should return error result on repository error', async () => {
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {} as IMetadataBlocksRepository
    metadataBlocksRepositoryStub.getAllMetadataBlocks = jest.fn().mockRejectedValue(new ReadError())
    const testGetCollectionMetadataBlocks = new GetAllMetadataBlocks(metadataBlocksRepositoryStub)

    await expect(testGetCollectionMetadataBlocks.execute()).rejects.toThrow(ReadError)
  })
})
