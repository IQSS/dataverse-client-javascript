import { ApiConfig, WriteError, deleteCurrentApiToken } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { createApiTokenViaApi } from '../../testHelpers/users/apiTokenHelper'

describe('execute', () => {
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully recreate the API token', async () => {
    const testApiToken = await createApiTokenViaApi('deleteCurrentApiTokenFTUser')
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
    await deleteCurrentApiToken.execute()
    // Since the token has been deleted, the next call using it should return a WriteError
    await expect(deleteCurrentApiToken.execute()).rejects.toBeInstanceOf(WriteError)
  })
})
