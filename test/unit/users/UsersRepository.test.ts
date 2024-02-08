import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import axios from 'axios'
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'

describe('getCurrentAuthenticatedUser', () => {
  const sut: UsersRepository = new UsersRepository()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should return authenticated user on successful response', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          id: testAuthenticatedUser.id,
          persistentUserId: testAuthenticatedUser.persistentUserId,
          identifier: testAuthenticatedUser.identifier,
          displayName: testAuthenticatedUser.displayName,
          firstName: testAuthenticatedUser.firstName,
          lastName: testAuthenticatedUser.lastName,
          email: testAuthenticatedUser.email,
          superuser: testAuthenticatedUser.superuser,
          deactivated: testAuthenticatedUser.deactivated,
          createdTime: testAuthenticatedUser.createdTime,
          authenticationProviderId: testAuthenticatedUser.authenticationProviderId,
          lastLoginTime: testAuthenticatedUser.lastLoginTime,
          lastApiUseTime: testAuthenticatedUser.lastApiUseTime
        }
      }
    }
    jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/users/:me`

    // API Key auth
    let actual = await sut.getCurrentAuthenticatedUser()

    expect(axios.get).toHaveBeenCalledWith(
      expectedApiEndpoint,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
    expect(actual).toMatchObject(testAuthenticatedUser)

    // Session cookie auth
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
    actual = await sut.getCurrentAuthenticatedUser()

    expect(axios.get).toHaveBeenCalledWith(
      expectedApiEndpoint,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
    )
    expect(actual).toMatchObject(testAuthenticatedUser)
  })

  test('should return error result on error response', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

    let error: ReadError = undefined
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e))

    expect(axios.get).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/users/:me`,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
    expect(error).toBeInstanceOf(Error)
  })
})
