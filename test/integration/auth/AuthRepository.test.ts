import { AuthRepository } from '../../../src/auth/infra/repositories/AuthRepository'
import { assert } from 'sinon'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('logout', () => {
  const sut: AuthRepository = new AuthRepository()

  ApiConfig.init(
    TestConstants.TEST_API_URL,
    DataverseApiAuthMechanism.API_KEY,
    process.env.TEST_API_KEY
  )

  test('should return error due to disabled feature flag', async () => {
    let error: WriteError = undefined
    await sut.logout().catch((e) => (error = e))

    assert.match(
      error.message,
      'There was an error when writing the resource. Reason was: [500] This endpoint is only available when session authentication feature flag is enabled'
    )
  })
})
