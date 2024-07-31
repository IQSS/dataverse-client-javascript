import { MetadataFieldInfosRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataFieldInfosRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getAllFacetableMetadataFields', () => {
  const sut: MetadataFieldInfosRepository = new MetadataFieldInfosRepository()

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return all facetable metadata fields', async () => {
    const actual = await sut.getAllFacetableMetadataFields()

    expect(actual.length).toBe(59)
    expect(actual[0].name).toBe('authorName')
    expect(actual[0].displayName).toBe('Author Name')
  })
})
