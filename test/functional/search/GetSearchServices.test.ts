import { ApiConfig, getSearchServices } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { SearchService } from '../../../src/search/domain/models/SearchService'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully return search services', async () => {
    const searchServices: SearchService[] = await getSearchServices.execute()

    expect(searchServices).toBeDefined()
    expect(searchServices.length).toBe(1)
    expect(searchServices[0].name).toBe('solr')
    expect(searchServices[0].displayName).toBe('Dataverse Standard Search')
  })
})
