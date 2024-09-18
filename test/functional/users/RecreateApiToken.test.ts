import { ApiConfig, recreateApiToken } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { createApiTokenViaApi } from '../../testHelpers/users/apiTokenHelper'

describe('execute', () => {
  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully recreate the API token', async () => {
    const testApiToken = await createApiTokenViaApi()
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
    const actualNewApiToken = await recreateApiToken.execute()
    expect(actualNewApiToken).not.toBe(testApiToken)
  })
})
