import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { assert } from 'sinon'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getCurrentAuthenticatedUser', () => {
  const sut: UsersRepository = new UsersRepository()

  test('should return error when authentication is not valid', async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, 'invalidApiKey')

    let error: ReadError = undefined
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e))

    assert.match(
      error.message,
      'There was an error when reading the resource. Reason was: [401] Bad API key'
    )
  })

  test('should return authenticated user when valid authentication is provided', async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )

    const actual = await sut.getCurrentAuthenticatedUser()

    assert.match(actual.firstName, 'Dataverse')
  })
})
