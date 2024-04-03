import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getMetadataBlockByName', () => {
  const sut: MetadataBlocksRepository = new MetadataBlocksRepository()
  const citationMetadataBlockName = 'citation'

  ApiConfig.init(
    TestConstants.TEST_API_URL,
    DataverseApiAuthMechanism.API_KEY,
    process.env.TEST_API_KEY
  )

  test('should return error when metadata block does not exist', async () => {
    const nonExistentMetadataBlockName = 'nonExistentMetadataBlock'
    const errorExpected: ReadError = new ReadError(
      `[404] Can't find metadata block '${nonExistentMetadataBlockName}'`
    )

    await expect(sut.getMetadataBlockByName(nonExistentMetadataBlockName)).rejects.toThrow(
      errorExpected
    )
  })

  test('should return metadata block when it exists', async () => {
    const actual = await sut.getMetadataBlockByName(citationMetadataBlockName)

    expect(actual.name).toBe(citationMetadataBlockName)
  })

  test('should return collection metadata blocks', async () => {
    const actual = await sut.getCollectionMetadataBlocks('root', true)

    expect(actual.length).toBe(1)
    expect(actual[0].name).toBe(citationMetadataBlockName)
    expect(actual[0].metadataFields.title.name).toBe('title')
  })
})
