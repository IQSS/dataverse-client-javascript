import { ApiConfig, getAllMetadataBlocks, MetadataBlock } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully return metadatablocks', async () => {
    let metadataBlocks: MetadataBlock[] = null
    try {
      metadataBlocks = await getAllMetadataBlocks.execute()
    } catch (error) {
      throw new Error('Should not raise an error')
    } finally {
      expect(metadataBlocks).not.toBeNull()
      expect(metadataBlocks.length).toBe(6)
      expect(metadataBlocks[0].metadataFields.title.name).toBe('title')
    }
  })
})
