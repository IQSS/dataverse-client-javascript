import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { SearchServicesRepository } from '../../../src/search/infra/repositories/SearchServicesRepository'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('SearchServicesRepository', () => {
  const sut: SearchServicesRepository = new SearchServicesRepository()

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getSearchServices', () => {
    test('should return search services', async () => {
      const actual = await sut.getSearchServices()
      expect(actual.length).toEqual(1)
      expect(actual[0].name).toEqual('solr')
      expect(actual[0].displayName).toEqual('Dataverse Standard Search')
    })
  })
})
