import { AuthRepository } from '../../../src/auth/infra/repositories/AuthRepository'
import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('logout', () => {
  const sut: AuthRepository = new AuthRepository()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should not return error on successful response', async () => {
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: 'User logged out'
        }
      }
    }
    jest.spyOn(axios, 'post').mockResolvedValue(testSuccessfulResponse)
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/logout`

    // API Key auth
    await sut.logout()

    expect(axios.post).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )

    // Session cookie auth
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

    await sut.logout()

    expect(axios.post).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
    )
  })

  test('should return error result on error response', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

    let error: WriteError = undefined
    await sut.logout().catch((e) => (error = e))

    expect(axios.post).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/logout`,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
    expect(error).toBeInstanceOf(Error)
  })
})
