import { ApiConfig, getCurrentApiToken } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return the current API token', async () => {
    const actualTokenInfo = await getCurrentApiToken.execute()
    expect(actualTokenInfo.apiToken).toBe(process.env.TEST_API_KEY)
    expect(typeof actualTokenInfo.expirationDate).toBe('object')
  })
})
