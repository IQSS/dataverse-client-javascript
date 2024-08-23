import { ApiConfig, MetadataFieldInfo, getAllFacetableMetadataFields } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('execute', () => {
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return all facetable metadata fields', async () => {
    let metadataFieldInfos: MetadataFieldInfo[] = null
    try {
      metadataFieldInfos = await getAllFacetableMetadataFields.execute()
    } catch (error) {
      throw new Error('Should not raise an error')
    } finally {
      expect(metadataFieldInfos.length).toBe(59)
      expect(metadataFieldInfos[0].name).toBe('authorName')
      expect(metadataFieldInfos[0].displayName).toBe('Author Name')
    }
  })
})
