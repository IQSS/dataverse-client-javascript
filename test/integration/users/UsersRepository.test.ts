import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'

describe('getCurrentAuthenticatedUser', () => {
  const sut: UsersRepository = new UsersRepository()

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
