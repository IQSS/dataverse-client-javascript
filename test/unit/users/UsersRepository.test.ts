import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import axios from 'axios'
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, SignUpDTO, WriteError } from '../../../src'

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

    let error: ReadError | undefined = undefined
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e))

    expect(axios.get).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/users/:me`,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
    expect(error).toBeInstanceOf(Error)
  })
})

describe('getCurrentAuthenticatedUser authenticatedOrcid', () => {
  const sut: UsersRepository = new UsersRepository()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should map authenticatedOrcid when present', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        status: 'OK',
        data: {
          ...testAuthenticatedUser,
          authenticatedOrcid: 'https://orcid.org/0000-0002-1825-0097'
        }
      }
    })

    const actual = await sut.getCurrentAuthenticatedUser()

    expect(actual.authenticatedOrcid).toBe('https://orcid.org/0000-0002-1825-0097')
  })
})

describe('signUp', () => {
  const sut: UsersRepository = new UsersRepository()
  const testSignUpDTO: SignUpDTO = {
    username: 'alovelace',
    firstName: 'Ada',
    lastName: 'Lovelace',
    emailAddress: 'ada@example.edu',
    password: 'Str0ngPassw0rd',
    affiliation: 'Harvard University',
    termsAccepted: true,
    orcidToken: 'orcid-token'
  }
  const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/users/signup`

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should post the sign-up without credentials and return created', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      status: 201,
      data: { status: 'OK', data: { identifier: '@alovelace' } }
    })

    const actual = await sut.signUp(testSignUpDTO)

    expect(axios.post).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(testSignUpDTO),
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    expect(actual).toEqual({ status: 'created', identifier: '@alovelace' })
  })

  test('should return pending when the response is 202 Accepted', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      status: 202,
      data: { status: 'OK', data: { message: 'Check your email.' } }
    })

    const actual = await sut.signUp(testSignUpDTO)

    expect(actual).toEqual({ status: 'pending' })
  })

  test('should reject with a WriteError carrying statusCode and fieldErrors', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 400,
        data: {
          status: 'ERROR',
          message: 'The provided fields are invalid for signing up a new user.',
          fieldErrors: { username: 'This username is already taken.' }
        }
      }
    })

    let error: WriteError | undefined = undefined
    await sut.signUp(testSignUpDTO).catch((e) => (error = e))

    expect(error).toBeInstanceOf(WriteError)
    expect((error as unknown as WriteError).statusCode).toBe(400)
    expect((error as unknown as WriteError).fieldErrors).toEqual({
      username: 'This username is already taken.'
    })
    expect((error as unknown as WriteError).message).toContain(
      '[400] The provided fields are invalid for signing up a new user.'
    )
  })
})

describe('getOrcidSignUpAuthorizationUrl', () => {
  const sut: UsersRepository = new UsersRepository()
  const redirectUri = 'http://127.0.0.1:8000/spa/sign-up'

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should request the authorization URL without credentials', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: {
        status: 'OK',
        data: { authorizationUrl: 'https://orcid.org/oauth/authorize?client_id=APP-1' }
      }
    })

    const actual = await sut.getOrcidSignUpAuthorizationUrl(redirectUri)

    expect(axios.get).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/users/signup/orcid/authorize`,
      { ...TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG, params: { redirectUri } }
    )
    expect(actual).toBe('https://orcid.org/oauth/authorize?client_id=APP-1')
  })

  test('should reject with a ReadError carrying the status code', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue({
      response: {
        status: 404,
        data: { status: 'ERROR', message: 'ORCID is not configured on this installation.' }
      }
    })

    let error: ReadError | undefined = undefined
    await sut.getOrcidSignUpAuthorizationUrl(redirectUri).catch((e) => (error = e))

    expect(error).toBeInstanceOf(ReadError)
    expect((error as unknown as ReadError).statusCode).toBe(404)
    expect((error as unknown as ReadError).fieldErrors).toBeUndefined()
  })
})

describe('connectOrcidForSignUp', () => {
  const sut: UsersRepository = new UsersRepository()
  const callback = {
    code: 'orcid-code',
    state: 'orcid-state',
    redirectUri: 'http://127.0.0.1:8000/spa/sign-up'
  }

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should post the ORCID callback without credentials and map the connection', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      status: 200,
      data: {
        status: 'OK',
        data: {
          orcid: 'https://orcid.org/0000-0002-1825-0097',
          orcidToken: 'orcid-token',
          firstName: 'Josiah',
          lastName: 'Carberry'
        }
      }
    })

    const actual = await sut.connectOrcidForSignUp(callback)

    expect(axios.post).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/users/signup/orcid`,
      JSON.stringify(callback),
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    expect(actual).toEqual({
      orcid: 'https://orcid.org/0000-0002-1825-0097',
      orcidToken: 'orcid-token',
      firstName: 'Josiah',
      lastName: 'Carberry'
    })
  })

  test('should reject with a 409 WriteError when the ORCID iD is already linked', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 409,
        data: { status: 'ERROR', message: 'This ORCID iD is already linked to another account.' }
      }
    })

    let error: WriteError | undefined = undefined
    await sut.connectOrcidForSignUp(callback).catch((e) => (error = e))

    expect(error).toBeInstanceOf(WriteError)
    expect((error as unknown as WriteError).statusCode).toBe(409)
  })
})
