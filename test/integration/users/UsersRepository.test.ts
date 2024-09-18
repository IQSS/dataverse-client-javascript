import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, WriteError } from '../../../src'
import { createApiTokenViaApi } from '../../testHelpers/users/apiTokenHelper'

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

  describe('recreateApiToken', () => {
    test('should recreate API token and return the new API token info when valid authentication is provided', async () => {
      const testApiToken = await createApiTokenViaApi('recreateApiTokenITUser')
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
      const actualRecreatedApiTokenInfo = await sut.recreateApiToken()
      expect(actualRecreatedApiTokenInfo.apiToken).not.toBeUndefined()
      expect(actualRecreatedApiTokenInfo.apiToken).not.toBe(testApiToken)
      expect(typeof actualRecreatedApiTokenInfo.expirationDate).toBe('object')
    })

    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: WriteError = new WriteError('[401] Bad API key')
      await expect(sut.recreateApiToken()).rejects.toThrow(errorExpected)
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
})
