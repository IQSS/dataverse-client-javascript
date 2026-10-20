import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, SignUpDTO, WriteError } from '../../../src'
import { createApiTokenViaApi } from '../../testHelpers/users/apiTokenHelper'
import {
  deleteAuthenticatedUserViaAdminApi,
  getAuthenticatedUserViaAdminApi
} from '../../testHelpers/users/builtinUserApiHelper'

describe('UsersRepository', () => {
  const sut: UsersRepository = new UsersRepository()

  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getCurrentAuthenticatedUser', () => {
    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: ReadError = new ReadError('[401] Bad API key')
      await expect(sut.getCurrentAuthenticatedUser()).rejects.toThrow(errorExpected)
    })

    test('should return authenticated user when valid authentication is provided', async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
      const actual = await sut.getCurrentAuthenticatedUser()
      expect(actual.firstName).toBe('Dataverse')
    })
  })

  describe('recreateCurrentApiToken', () => {
    test('should recreate API token and return the new API token info when valid authentication is provided', async () => {
      const testApiToken = await createApiTokenViaApi('recreateCurrentApiTokenITUser')
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
      const actualRecreatedApiTokenInfo = await sut.recreateCurrentApiToken()
      expect(actualRecreatedApiTokenInfo.apiToken).not.toBeUndefined()
      expect(actualRecreatedApiTokenInfo.apiToken).not.toBe(testApiToken)
      expect(typeof actualRecreatedApiTokenInfo.expirationDate).toBe('object')
    })

    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: WriteError = new WriteError('[401] Bad API key')
      await expect(sut.recreateCurrentApiToken()).rejects.toThrow(errorExpected)
    })
  })

  describe('getCurrentApiToken', () => {
    test('should return API token info when valid authentication is provided', async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
      const actualApiTokenInfo = await sut.getCurrentApiToken()
      expect(actualApiTokenInfo.apiToken).not.toBeUndefined()
      expect(actualApiTokenInfo.apiToken).toBe(process.env.TEST_API_KEY)
      expect(typeof actualApiTokenInfo.expirationDate).toBe('object')
    })

    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: ReadError = new ReadError('[401] Bad API key')
      await expect(sut.getCurrentApiToken()).rejects.toThrow(errorExpected)
    })
  })

  describe('deleteCurrentApiToken', () => {
    test('should return API token info when valid authentication is provided', async () => {
      const testApiToken = await createApiTokenViaApi('deleteCurrentApiTokenITUser')
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
      await sut.deleteCurrentApiToken()
      // Since the token has been deleted, the next call using it should return 401
      const errorExpected: WriteError = new WriteError('[401] Bad API key')
      await expect(sut.deleteCurrentApiToken()).rejects.toThrow(errorExpected)
    })

    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: WriteError = new WriteError('[401] Bad API key')
      await expect(sut.deleteCurrentApiToken()).rejects.toThrow(errorExpected)
    })
  })

  describe('signUp', () => {
    const uniqueSuffix = Date.now().toString(36)
    const testSignUpDTO: SignUpDTO = {
      username: `signup${uniqueSuffix}`,
      firstName: 'Ada',
      lastName: 'Lovelace',
      emailAddress: `signup${uniqueSuffix}@mailinator.com`,
      password: 'Str0ngPassw0rd1',
      affiliation: 'Harvard University',
      position: 'Researcher',
      termsAccepted: true
    }

    beforeEach(() => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    afterAll(async () => {
      await deleteAuthenticatedUserViaAdminApi(testSignUpDTO.username).catch(() => undefined)
    })

    test('should create a builtin user without sending the configured credentials', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const actual = await sut.signUp(testSignUpDTO)

      expect(actual).toEqual({ status: 'created', identifier: `@${testSignUpDTO.username}` })
      const createdUser = await getAuthenticatedUserViaAdminApi(testSignUpDTO.username)
      expect(createdUser.authenticationProviderId).toBe('builtin')
      expect(createdUser.email).toBe(testSignUpDTO.emailAddress)
      expect(createdUser.affiliation).toBe('Harvard University')
      expect(createdUser.authenticatedOrcid).toBeUndefined()
    })

    test('should return field errors when the username and email are already taken', async () => {
      let error: WriteError | undefined = undefined
      await sut.signUp(testSignUpDTO).catch((e) => (error = e))

      expect(error).toBeInstanceOf(WriteError)
      expect((error as unknown as WriteError).statusCode).toBe(400)
      expect((error as unknown as WriteError).fieldErrors).toEqual(
        expect.objectContaining({
          username: 'This username is already taken.',
          emailAddress: 'This email address is already taken.'
        })
      )
    })

    test('should return field errors for invalid values', async () => {
      let error: WriteError | undefined = undefined
      await sut
        .signUp({
          username: 'not valid!',
          firstName: '',
          lastName: '',
          emailAddress: 'not-an-email',
          password: 'x',
          termsAccepted: false
        })
        .catch((e) => (error = e))

      expect(error).toBeInstanceOf(WriteError)
      expect((error as unknown as WriteError).statusCode).toBe(400)
      expect(Object.keys((error as unknown as WriteError).fieldErrors ?? {})).toEqual(
        expect.arrayContaining([
          'username',
          'firstName',
          'lastName',
          'emailAddress',
          'password',
          'termsAccepted'
        ])
      )
    })

    test('should reject an invalid orcidToken with an orcid field error', async () => {
      let error: WriteError | undefined = undefined
      await sut
        .signUp({
          ...testSignUpDTO,
          username: `${testSignUpDTO.username}x`,
          emailAddress: `x${testSignUpDTO.emailAddress}`,
          orcidToken: 'not-a-valid-token'
        })
        .catch((e) => (error = e))

      expect(error).toBeInstanceOf(WriteError)
      expect((error as unknown as WriteError).statusCode).toBe(400)
      expect((error as unknown as WriteError).fieldErrors).toEqual({
        orcid: 'Your ORCID connection has expired. Please connect your ORCID iD again.'
      })
    })
  })

  describe('ORCID at sign-up without an ORCID provider', () => {
    const redirectUri = 'http://localhost:8000/spa/sign-up'

    test('getOrcidSignUpAuthorizationUrl should return a 404 ReadError', async () => {
      let error: ReadError | undefined = undefined
      await sut.getOrcidSignUpAuthorizationUrl(redirectUri).catch((e) => (error = e))

      expect(error).toBeInstanceOf(ReadError)
      expect((error as unknown as ReadError).statusCode).toBe(404)
      expect((error as unknown as ReadError).message).toContain(
        'ORCID is not configured on this installation.'
      )
    })

    test('connectOrcidForSignUp should return a 404 WriteError', async () => {
      let error: WriteError | undefined = undefined
      await sut
        .connectOrcidForSignUp({ code: 'code', state: 'state', redirectUri })
        .catch((e) => (error = e))

      expect(error).toBeInstanceOf(WriteError)
      expect((error as unknown as WriteError).statusCode).toBe(404)
    })
  })
})
