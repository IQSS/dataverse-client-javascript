import { GetMetadataBlockByName } from '../../../src/metadataBlocks/domain/useCases/GetMetadataBlockByName'
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createMetadataBlockModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'

describe('execute', () => {
  const testMetadataBlockName = 'test'

  test('should return metadata block on repository success', async () => {
    const testMetadataBlock = createMetadataBlockModel()
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {
      getMetadataBlockByName: jest.fn().mockReturnValue(testMetadataBlock)
    }
    const sut = new GetMetadataBlockByName(metadataBlocksRepositoryStub)

    const actual = await sut.execute(testMetadataBlockName)

    expect(actual).toMatchObject(testMetadataBlock)
    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlockName
    )
  })

  test('should return error result on repository error', async () => {
    const metadataBlocksRepositoryStub: IMetadataBlocksRepository = {
      getMetadataBlockByName: jest.fn().mockRejectedValue(new ReadError())
    }
    const sut = new GetMetadataBlockByName(metadataBlocksRepositoryStub)

    let actualError: ReadError
    await sut.execute(testMetadataBlockName).catch((e) => (actualError = e))

    expect(actualError).toBeInstanceOf(ReadError)
  })
})
