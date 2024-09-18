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
    test('should recreate API token when valid authentication is provided', async () => {
      const testApiToken = await createApiTokenViaApi()
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, testApiToken)
      const actualRecreatedApiToken = await sut.recreateApiToken()
      expect(actualRecreatedApiToken).not.toBe(testApiToken)
    })

    test('should return error when authentication is not valid', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

      const errorExpected: WriteError = new WriteError('[401] Bad API key')
      await expect(sut.recreateApiToken()).rejects.toThrow(errorExpected)
    })
  })
})
